import { useCallback, useState } from 'react'
import type { Sprite } from 'pixi.js'

export type ItemType = 'image' | 'video'

export type BoardItem = {
  id: string
  type: ItemType
  url: string
  pixi?: Sprite
}

function uid(){
  return Math.random().toString(36).slice(2, 9)
}

export function useBoardItems() {
  const [items, setItems] = useState<BoardItem[]>([])

  const addItem = useCallback((item: Omit<BoardItem, 'id'>) => {
    const id = uid()
    setItems(s => [...s, { id, ...item }])
    return id
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(s => s.filter(it => it.id !== id))
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<BoardItem>) => {
    setItems(s => s.map(it => it.id === id ? { ...it, ...patch } : it))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  return { items, addItem, removeItem, updateItem, clear }
}
