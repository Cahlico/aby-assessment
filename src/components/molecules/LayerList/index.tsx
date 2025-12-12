import LayerItem from '../../atoms/LayerItem'
import { LayerListWrapper, Title } from './LayerList.styles'
import type { BoardItem } from '../../organisms/Whiteboard/CanvasSurface'

type Props = {
  items: BoardItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

export default function LayerList({
  items,
  selectedId,
  onSelect,
}: Props) {
  return (
    <LayerListWrapper>
      <Title>Layers</Title>

      {items.map((item, index) => (
        <LayerItem
          key={item.id}
          id={item.id}
          label={`${item.type.toUpperCase()} ${index + 1}`}
          type={item.type}
          selected={item.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </LayerListWrapper>
  )
}

