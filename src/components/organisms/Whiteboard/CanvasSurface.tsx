import { useEffect, useRef, useCallback } from 'react'
import { CanvasHost } from './CanvasSurface.styles'
import * as PIXI from 'pixi.js'
import { TransformControls } from '../../../core/pixi/TransformControls'

export type BoardItem = {
  id: string
  type: 'image' | 'video'
  url: string
  x: number
  y: number
  scale: number
  rotation: number

}

type Props = {
  items: BoardItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onFileDrop?: (file: File) => void
  onCanvasReady?: (width: number, height: number) => void
}

type SpriteData = {
  sprite: PIXI.Sprite
  videoElement?: HTMLVideoElement

}

export default function CanvasSurface({
  items,
  selectedId,
  onSelect,
  onRemove,
  onCanvasReady
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const spriteMapRef = useRef<Map<string, SpriteData>>(new Map())
  const controlsRef = useRef<TransformControls | null>(null)
  const spriteContainerRef = useRef<PIXI.Container | null>(null)
  const controlsContainerRef = useRef<PIXI.Container | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const app = new PIXI.Application()
    appRef.current = app

    app.init({
      background: '#1a1a1a',
      antialias: true,
      width: host.clientWidth || 800,
      height: host.clientHeight || 600,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1
    }).then(() => {
      if (host && app.canvas) {
        host.appendChild(app.canvas)

        const spriteContainer = new PIXI.Container()
        const controlsContainer = new PIXI.Container()
        
        spriteContainerRef.current = spriteContainer
        controlsContainerRef.current = controlsContainer
        
        const grid = createGrid(app.canvas.width, app.canvas.height)
        app.stage.addChild(grid)
        app.stage.eventMode = 'static'
        app.stage.hitArea = app.screen
        app.stage.addChild(spriteContainer)
        app.stage.addChild(controlsContainer)

        if (onCanvasReady) {
          onCanvasReady(app.canvas.width, app.canvas.height)
        }

        app.ticker.add(() => {
          spriteMapRef.current.forEach(data => {
            if (data.videoElement && !data.videoElement.paused) {
              if (data.sprite.texture && data.sprite.texture.source) {
                data.sprite.texture.source.update()
              }
            }
          })
        })

        app.stage.on('pointerdown', () => {
          onSelect(null)
        })
      }
    }).catch((error) => {
      console.error('Failed to initialize Pixi:', error)
    })

    return () => {
      spriteMapRef.current.forEach(data => {
        try {
          if (data.videoElement) {
            data.videoElement.pause()
            data.videoElement.src = ''
            data.videoElement.load()
          }
          data.sprite.destroy({ texture: true, textureSource: true })
        } catch (e) {
          console.error('Cleanup error:', e)
        }
      })
      spriteMapRef.current.clear()
      
      if (controlsRef.current) {
        controlsRef.current.destroy()
        controlsRef.current = null
      }
      
      app.destroy({ removeView: true })
      appRef.current = null
    }
  }, [onCanvasReady])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault()
        onRemove(selectedId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, onRemove])

  const setupSprite = useCallback(
    (
      sprite: PIXI.Sprite,
      item: BoardItem,
      container: PIXI.Container,
      onSelect: (id: string) => void
    ) => {
      sprite.eventMode = 'static'
      sprite.cursor = 'pointer'
      sprite.anchor.set(0.5)
      sprite.x = item.x
      sprite.y = item.y
      sprite.rotation = item.rotation
      sprite.scale.set(item.scale)

      sprite.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
        e.stopPropagation()
        onSelect(item.id)

        const spriteData = spriteMapRef.current.get(item.id)
        if (spriteData?.videoElement) {
          spriteData.videoElement.play().catch(() => {})
        }
      })

      container.addChild(sprite)
    },
    []
  )

  const createImageSprite = useCallback(
    (item: BoardItem, container: PIXI.Container) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        const texture = PIXI.Texture.from(img)
        const sprite = new PIXI.Sprite(texture)

        setupSprite(sprite, item, container, onSelect)

        const spriteData: SpriteData = { sprite }
        spriteMapRef.current.set(item.id, spriteData)


      }

      img.onerror = (error) => {
        console.error('Failed to load image:', error)
      }

      img.src = item.url
    }, [onSelect, setupSprite])

  const createVideoSprite = useCallback(
    (item: BoardItem, container: PIXI.Container) => {
      const video = document.createElement('video')
      video.src = item.url
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      video.crossOrigin = 'anonymous'
      video.preload = 'auto'

      video.addEventListener(
        'loadeddata',
        () => {
          const texture = PIXI.Texture.from(video, {
            resourceOptions: {
              autoPlay: true,
              updateFPS: 30
            }
          })
          const sprite = new PIXI.Sprite(texture)

          setupSprite(sprite, item, container, onSelect)

          const spriteData: SpriteData = { sprite, videoElement: video }
          spriteMapRef.current.set(item.id, spriteData)

          video.play().catch(error => {
            console.log('Video autoplay blocked, will play on user interaction:', error)
          })
        },
        { once: true }
      )
      
      video.addEventListener('error', (e) => {
        console.error('Video loading error:', e)
      })

      video.load()
    }, [onSelect, setupSprite])

  useEffect(() => {
    const spriteContainer = spriteContainerRef.current
    if (!spriteContainer) return

    const itemIds = new Set(items.map(i => i.id))

    spriteMapRef.current.forEach((data, id) => {
      if (!itemIds.has(id)) {
        try {
          spriteContainer.removeChild(data.sprite)
          if (data.videoElement) {
            data.videoElement.pause()
            data.videoElement.src = ''
            data.videoElement.load()
          }
          data.sprite.destroy({ texture: true, textureSource: true })
        } catch (e) {
          console.error('Error removing sprite:', e)
        }
        spriteMapRef.current.delete(id)
      }
    })

    items.forEach(item => {
      const spriteData = spriteMapRef.current.get(item.id)

      if (!spriteData) {
        if (item.type === 'image') {
          createImageSprite(item, spriteContainer)
        } else {
          createVideoSprite(item, spriteContainer)
        }
      } else {
        spriteData.sprite.x = item.x
        spriteData.sprite.y = item.y
        spriteData.sprite.rotation = item.rotation
        spriteData.sprite.scale.set(item.scale)


      }
    })
  }, [items, createImageSprite, createVideoSprite])

  useEffect(() => {
    const controlsContainer = controlsContainerRef.current
    if (!controlsContainer) return

    if (controlsRef.current) {
      controlsContainer.removeChild(controlsRef.current)
      controlsRef.current.destroy()
      controlsRef.current = null
    }

    if (selectedId) {
      const spriteData = spriteMapRef.current.get(selectedId)
      if (spriteData) {
        const controls = new TransformControls(spriteData.sprite, (transform) => {
          const event = new CustomEvent('whiteboard-transform', {
            detail: { id: selectedId, ...transform }
          })
          hostRef.current?.dispatchEvent(event)
        })
        
        controlsContainer.addChild(controls)
        controlsRef.current = controls
      }
    }
  }, [selectedId])

  return (
    <CanvasHost ref={hostRef} />
  )
}

function createGrid(width: number, height: number): PIXI.Graphics {
  const grid = new PIXI.Graphics()
  const gridSize = 50
  const gridColor = 0x2a2a2a

  for (let x = 0; x <= width; x += gridSize) {
    grid.moveTo(x, 0)
    grid.lineTo(x, height)
  }

  for (let y = 0; y <= height; y += gridSize) {
    grid.moveTo(0, y)
    grid.lineTo(width, y)
  }

  grid.stroke({ color: gridColor, width: 1 })
  return grid
}
