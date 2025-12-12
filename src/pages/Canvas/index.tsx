import { Whiteboard } from '../../components'

export default function Canvas() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
        <Whiteboard />
      </div>
    </div>
  )
}
