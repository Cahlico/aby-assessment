import styled from 'styled-components'

export const MainContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  color: #333;
`

export const Sidebar = styled.div`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #ddd;
  background: #fafafa;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
`

export const ToolbarSection = styled.div`
  h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
  }
`

export const FileInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
`

export const SelectedControls = styled.div`
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
`

export const SelectedTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
`

export const DeleteButton = styled.button`
  width: 100%;
  padding: 8px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  transition: background 0.2s;

  &:hover {
    background: #d32f2f;
  }
`

export const LayersSection = styled.div`
  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
  }
`

export const LayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const LayerItem = styled.div<{ $isSelected: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background: ${props => (props.$isSelected ? '#2196F3' : '#fff')};
  color: ${props => (props.$isSelected ? '#fff' : '#333')};
  border-radius: 4px;
  font-size: 13px;
  border: 1px solid;
  border-color: ${props => (props.$isSelected ? '#2196F3' : '#ddd')};
  transition: all 0.2s;

  &:hover {
    background: ${props => (props.$isSelected ? '#1976D2' : '#f5f5f5')};
    border-color: ${props => (props.$isSelected ? '#1976D2' : '#ccc')};
  }
`

export const ControlsBox = styled.div`
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;

  strong {
    display: block;
    margin-bottom: 8px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
  }
`

export const CanvasWrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`

export const CanvasHost = styled.div`
  width: 100%;
  height: 100%;
`
