import styled from 'styled-components'

export const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: Inter, system-ui;
`

export const Sidebar = styled.div`
  width: 260px;
  padding: 16px;
  border-right: 1px solid #eee;
  background: #fafafa;
  color: #333;
`

export const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: stretch;
  overflow: hidden;
`
