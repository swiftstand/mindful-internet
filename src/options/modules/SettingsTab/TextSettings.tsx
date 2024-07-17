import React, {ReactNode} from 'react'
import {useSyncedState} from '@utils'
import {TextInput} from '@option-ui'

interface QuizProps {
  placeHolder?: string | null
}

export const QuizCode = (props: QuizProps) => {
  const [codeValue, setCodeValue] = useSyncedState('quizCode')
  return (
    <InputText
      placeHolder={props.placeHolder ? props.placeHolder : null}
      value={codeValue}
      onChange={setCodeValue}
    />
  )
}

interface TextBoxInputProps {
  /** State of the switch or null if not initialized */
  value: string | null
  placeHolder?: string | null
  onChange: (value: string) => void
}

export const InputText = ({
  value,
  onChange,
  placeHolder,
}: TextBoxInputProps) => {
  return (
    <label className="flex items-center space-x-3 text-gray-400">
      <TextInput
        placeHolder={placeHolder ? placeHolder : undefined}
        boxValue={value ? value : ''}
        onChange={onChange}
      />
    </label>
  )
}

export const SettingSwitchContainer = ({children}: {children: ReactNode}) => {
  return <div className="flex flex-col space-y-2">{children}</div>
}
