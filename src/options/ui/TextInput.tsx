import React from 'react'
import {Combobox} from '@headlessui/react'

export interface TextInputProps {
  boxValue: string
  placeHolder?: string
  onChange: (boxValue: string) => void
}

export const TextInput = ({
  boxValue = '',
  placeHolder = 'Type here...',
  onChange,
}: TextInputProps) => {
  return (
    <Combobox value={boxValue} onChange={onChange}>
      <Combobox.Input
        onChange={e => onChange(e.target.value)}
        className="rounded border p-2"
        placeholder={placeHolder}
      />
    </Combobox>
  )
}
