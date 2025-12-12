import { useEffect } from 'react'
import type { Application } from 'pixi.js'
import type { BoardItem } from './useBoardItems'

export function useVideoTextures(appRef: React.MutableRefObject<Application | null>, items: BoardItem[]) {
  useEffect(() => {
    const app = appRef.current
    if (!app) return

    const ticker = () => {
      for (const it of items) {
        if (it.type === 'video' && it.pixi) {
          const base = it.pixi.texture.baseTexture
          base.resource?.update?.()
        }
      }
    }

    app.ticker.add(ticker)

    return () => {
      app.ticker.remove(ticker)
    }
  }, [appRef, items])
}
