import { useCallback, useEffect, useRef } from 'react'
import CanvasSurface from './CanvasSurface'
import { useWhiteboard } from '../../../hooks/useWhiteboard'
import Toolbar from '../../molecules/Toolbar'
import LayerList from '../../molecules/LayerList'
import Button from '../../atoms/Button'
import {
  MainContainer,
  Sidebar,
  SelectedControls,
  SelectedTitle,
  ControlsBox,
  CanvasWrapper,
  CanvasHost
} from './Whiteboard.styles'

export default function Whiteboard() {
  const {
    items,
    selectedId,
    addImage,
    addVideo,
    setSelectedId,
    removeItem,
    updateItem,
    setCanvasSize
  } = useWhiteboard()

  const hostRef = useRef<HTMLDivElement | null>(null)
  const selectedItem = items.find(item => item.id === selectedId)

  const onFileSelected = useCallback((file: File | null) => {
    if (!file) return
    const isVideo = file.type.startsWith('video/')
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (isVideo) addVideo(dataUrl)
      else addImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }, [addImage, addVideo])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const onTransform = (e: Event) => {
      const d = (e as CustomEvent).detail as {
        id: string
        x: number
        y: number
        scale: number
        rotation: number
      }
      updateItem(d.id, { x: d.x, y: d.y, scale: d.scale, rotation: d.rotation })
    }

    host.addEventListener('whiteboard-transform', onTransform as EventListener)

    return () => {
      host.removeEventListener('whiteboard-transform', onTransform as EventListener)
    }
  }, [updateItem])

  const handleFileDrop = useCallback((file: File) => {
    const isVideo = file.type.startsWith('video/')
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (isVideo) addVideo(dataUrl)
      else addImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }, [addImage, addVideo])

  const handleCanvasReady = useCallback((width: number, height: number) => {
    setCanvasSize(width, height)
  }, [setCanvasSize])

  const handleDelete = useCallback(() => {
    if (selectedId) {
      removeItem(selectedId)
    }
  }, [selectedId, removeItem])

  return (
    <MainContainer>
      <Sidebar>
        <Toolbar onUpload={onFileSelected} />

        {selectedId && selectedItem && (
          <SelectedControls>
            <SelectedTitle>
              Selected: {selectedItem.type.toUpperCase()}
            </SelectedTitle>
            
            <Button 
              label="Delete (or press Delete key)" 
              onClick={handleDelete} 
              style={{ 
                width: '100%', 
                backgroundColor: '#f44336', 
                color: 'white',
                marginBottom: '12px'
              }}
            />
          </SelectedControls>
        )}

        <LayerList
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRemove={removeItem}
        />

        <ControlsBox>
          <strong>Controls:</strong>
          <ul>
            <li>Click sprite to select</li>
            <li>Drag bounding box to move</li>
            <li>Drag blue corners to resize</li>
            <li>Drag green handle to rotate</li>
            <li>Delete key to remove</li>
          </ul>
        </ControlsBox>
      </Sidebar>

      <CanvasWrapper>
        <CanvasHost ref={hostRef}>
          <CanvasSurface
            items={items}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRemove={removeItem}
            onFileDrop={handleFileDrop}
            onCanvasReady={handleCanvasReady}
          />
        </CanvasHost>
      </CanvasWrapper>
    </MainContainer>
  )
}
