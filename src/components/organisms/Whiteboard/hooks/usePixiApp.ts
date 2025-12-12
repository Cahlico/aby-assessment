import { useEffect, useRef } from 'react'
import { Application } from 'pixi.js'

export function usePixiApp(hostRef?: React.RefObject<HTMLDivElement | null>) {
  const appRef = useRef<Application | null>(null)

  useEffect(() => {
    let mounted = true
    const app = new Application()
    appRef.current = app

    const init = async () => {
      try {
        await app.init({
          background: '#1a1a1a',
          antialias: true,
          resizeTo: hostRef?.current ?? undefined,
          autoDensity: true,
          resolution: window.devicePixelRatio || 1
        })

        if (!mounted) {
          app.destroy({ removeView: true })
          return
        }

        if (hostRef?.current && app.canvas) {
          hostRef.current.appendChild(app.canvas)
        }

        if (!app.ticker.started) {
          app.ticker.start()
        }
      } catch (error) {
        console.error('Error initializing Pixi app:', error)
      }
    }

    init()

    return () => {
      mounted = false
      try {
        app.destroy({ removeView: true })
      } catch (error) {
        console.error('Error destroying Pixi app:', error)
      }
      appRef.current = null
    }
  }, [hostRef])

  return appRef
}
