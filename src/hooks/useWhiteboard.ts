import { useState, useCallback, useRef } from 'react'
import type { BoardItem } from '../components/organisms/Whiteboard/CanvasSurface'
import { calculateSpiralPosition } from '../core/pixi/utils'

export function useWhiteboard() {
  const [items, setItems] = useState<BoardItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const canvasSizeRef = useRef({ width: 800, height: 600 })

  const setCanvasSize = useCallback((width: number, height: number) => {
    canvasSizeRef.current = { width, height }
  }, [])

  const addImage = useCallback((url: string) => {
    const id = crypto.randomUUID()
    setItems(prev => {
      const position = calculateSpiralPosition(
        prev.length,
        canvasSizeRef.current.width,
        canvasSizeRef.current.height
      )
      return [
        ...prev,
        { id, url, type: 'image', ...position, scale: 0.5, rotation: 0 }
      ]
    })
  }, [])

  const addVideo = useCallback((url: string) => {
    const id = crypto.randomUUID()
    setItems(prev => {
      const position = calculateSpiralPosition(
        prev.length,
        canvasSizeRef.current.width,
        canvasSizeRef.current.height
      )
      return [
        ...prev,
        { id, url, type: 'video', ...position, scale: 0.5, rotation: 0 }
      ]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    setSelectedId(s => s === id ? null : s)
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<BoardItem>) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it))
  }, [])

  return {
    items,
    selectedId,
    addImage,
    addVideo,
    setSelectedId,
    removeItem,
    updateItem,
    setCanvasSize
  }
}
