import { ItemWrapper } from './LayerItem.styles'

export type LayerItemProps = {
  id: string
  label: string
  type: 'image' | 'video'
  selected?: boolean
  onSelect?: (id: string) => void
}

export default function LayerItem({
  id,
  label,
  type,
  selected = false,
  onSelect
}: LayerItemProps) {
  return (
    <ItemWrapper
      selected={selected}
      onClick={() => onSelect && onSelect(id)}
    >
      <strong>{type}</strong> — {label}
    </ItemWrapper>
  )
}
