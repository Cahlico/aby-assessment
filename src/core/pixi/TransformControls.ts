import * as PIXI from 'pixi.js'

export type TransformHandle = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right'
  | 'rotation'
  | 'body'

export interface TransformData {
  x: number
  y: number
  scale: number
  rotation: number
}

export class TransformControls extends PIXI.Container {
  private boundingBox: PIXI.Graphics
  private handles: Map<TransformHandle, PIXI.Graphics>
  private rotationHandle: PIXI.Graphics
  private target: PIXI.Sprite
  private isDragging = false
  private dragHandle: TransformHandle | null = null
  private dragStartPos = { x: 0, y: 0 }
  private dragStartTransform: TransformData = { x: 0, y: 0, scale: 1, rotation: 0 }
  private onTransformCallback?: (data: TransformData) => void

  constructor(target: PIXI.Sprite, onTransform?: (data: TransformData) => void) {
    super()
    this.target = target
    this.onTransformCallback = onTransform

    this.boundingBox = new PIXI.Graphics()
    this.addChild(this.boundingBox)

    this.handles = new Map()
    const handleTypes: TransformHandle[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    handleTypes.forEach(type => {
      const handle = this.createHandle(8)
      handle.eventMode = 'static'
      handle.cursor = this.getCursor(type)
      this.handles.set(type, handle)
      this.addChild(handle)

      handle.on('pointerdown', (e: PIXI.FederatedPointerEvent) => this.onHandleDown(e, type))
    })

    this.rotationHandle = this.createHandle(8, 0x4CAF50)
    this.rotationHandle.eventMode = 'static'
    this.rotationHandle.cursor = 'grab'
    this.addChild(this.rotationHandle)
    this.rotationHandle.on('pointerdown', (e: PIXI.FederatedPointerEvent) => this.onHandleDown(e, 'rotation'))

    const hitArea = new PIXI.Graphics()
    hitArea.eventMode = 'static'
    hitArea.cursor = 'move'
    hitArea.on('pointerdown', (e: PIXI.FederatedPointerEvent) => this.onHandleDown(e, 'body'))
    this.addChild(hitArea)
    this.boundingBox = hitArea

    this.update()
  }

  private createHandle(size: number, color = 0x2196F3): PIXI.Graphics {
    const handle = new PIXI.Graphics()
    handle.circle(0, 0, size)
    handle.fill({ color })
    handle.stroke({ color: 0xFFFFFF, width: 2 })
    return handle
  }

  private getCursor(handle: TransformHandle): string {
    switch (handle) {
      case 'top-left':
      case 'bottom-right':
        return 'nwse-resize'
      case 'top-right':
      case 'bottom-left':
        return 'nesw-resize'
      default:
        return 'pointer'
    }
  }

  private onHandleDown(e: PIXI.FederatedPointerEvent, handle: TransformHandle) {
    e.stopPropagation()
    this.isDragging = true
    this.dragHandle = handle

    const globalPos = e.global
    this.dragStartPos = { x: globalPos.x, y: globalPos.y }
    this.dragStartTransform = {
      x: this.target.x,
      y: this.target.y,
      scale: this.target.scale.x,
      rotation: this.target.rotation
    }

    const stage = this.target.stage
    if (stage) {
      stage.eventMode = 'static'
      stage.on('pointermove', this.onDragMove)
      stage.on('pointerup', this.onDragEnd)
      stage.on('pointerupoutside', this.onDragEnd)
    }
  }

  private onDragMove = (e: PIXI.FederatedPointerEvent) => {
    if (!this.isDragging || !this.dragHandle) return

    const globalPos = e.global
    const dx = globalPos.x - this.dragStartPos.x
    const dy = globalPos.y - this.dragStartPos.y

    switch (this.dragHandle) {
      case 'body':
        this.handleMove(dx, dy)
        break
      case 'rotation':
        this.handleRotation(globalPos)
        break
      default:
        this.handleResize(this.dragHandle, globalPos)
        break
    }

    this.update()
    this.emitTransform()
  }

  private onDragEnd = () => {
    this.isDragging = false
    this.dragHandle = null

    const stage = this.target.stage
    if (stage) {
      stage.off('pointermove', this.onDragMove)
      stage.off('pointerup', this.onDragEnd)
      stage.off('pointerupoutside', this.onDragEnd)
    }
  }

  private handleMove(dx: number, dy: number) {
    this.target.x = this.dragStartTransform.x + dx
    this.target.y = this.dragStartTransform.y + dy
  }

  private handleRotation(globalPos: PIXI.Point) {
    const dx = globalPos.x - this.target.x
    const dy = globalPos.y - this.target.y
    const angle = Math.atan2(dy, dx)
    this.target.rotation = angle + Math.PI / 2
  }

  private handleResize(handle: TransformHandle, globalPos: PIXI.Point) {
    const localPos = this.target.parent.toLocal(globalPos)
    
    const vectorX = localPos.x - this.target.x
    const vectorY = localPos.y - this.target.y

    const distance = Math.sqrt(vectorX * vectorX + vectorY * vectorY)

    const dragStartLocal = this.target.parent.toLocal(this.dragStartPos)
    const initialVectorX = dragStartLocal.x - this.dragStartTransform.x
    const initialVectorY = dragStartLocal.y - this.dragStartTransform.y
    const initialDistance = Math.sqrt(initialVectorX * initialVectorX + initialVectorY * initialVectorY)

    const newScale = Math.max(0.1, this.dragStartTransform.scale * (distance / initialDistance))
    
    this.target.scale.set(newScale)
  }

  update() {
    const bounds = this.target.getBounds()

    this.boundingBox.clear()
    this.boundingBox.rect(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height
    )
    this.boundingBox.fill({ color: 0x2196F3, alpha: 0.05 })
    this.boundingBox.stroke({ color: 0x2196F3, width: 2 })

    this.handles.get('top-left')?.position.set(bounds.x, bounds.y)
    this.handles.get('top-right')?.position.set(bounds.x + bounds.width, bounds.y)
    this.handles.get('bottom-left')?.position.set(bounds.x, bounds.y + bounds.height)
    this.handles.get('bottom-right')?.position.set(bounds.x + bounds.width, bounds.y + bounds.height)

    this.rotationHandle.position.set(
      bounds.x + bounds.width / 2,
      bounds.y - 30
    )
  }

  private emitTransform() {
    if (this.onTransformCallback) {
      this.onTransformCallback({
        x: this.target.x,
        y: this.target.y,
        scale: this.target.scale.x,
        rotation: this.target.rotation
      })
    }
  }

  destroy() {
    const stage = this.target.stage
    if (stage) {
      stage.off('pointermove', this.onDragMove)
      stage.off('pointerup', this.onDragEnd)
      stage.off('pointerupoutside', this.onDragEnd)
    }

    super.destroy({ children: true })
  }
}
