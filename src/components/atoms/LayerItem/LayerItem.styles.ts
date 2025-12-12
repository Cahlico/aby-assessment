import styled from 'styled-components'

export const ItemWrapper = styled.div<{ selected: boolean }>`
  padding: 6px;
  border: 1px solid #ddd;
  margin: 4px 0;
  border-radius: 4px;
  cursor: pointer;
  background: ${p => (p.selected ? '#2196F3' : '#fff')};
  color: ${p => (p.selected ? '#fff' : '#333')};
  transition: background 0.15s ease;
  
  &:hover {
    background: ${p => (p.selected ? '#1976D2' : '#f5f5f5')};
    color: ${p => (p.selected ? '#fff' : '#333')};
  }


`
