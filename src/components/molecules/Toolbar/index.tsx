import Button from '../../atoms/Button'
import { ToolbarWrapper, ButtonGroup } from './Toolbar.styles'
import { type ChangeEvent, useRef } from 'react'

type Props = {
  onUpload: (file: File | null) => void
}

export default function Toolbar({ onUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onUpload(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <ToolbarWrapper>
      <ButtonGroup>
        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        {/* Trigger via button */}
        <Button label="Upload" onClick={handleButtonClick} />
      </ButtonGroup>
    </ToolbarWrapper>
  )
}
