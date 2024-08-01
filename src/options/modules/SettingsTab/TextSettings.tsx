import React, {ReactNode} from 'react'
import {useSyncedState} from '@utils'

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
  console.log(placeHolder)
  return (
    <ul className=" mb-3 max-h-[400px] overflow-y-auto py-2 pr-2">
      <li className="rounded odd:bg-mui-blue-dark even:bg-mui-blue">
        {/* <TextInput
          placeHolder={placeHolder ? placeHolder : undefined}
          boxValue={value ? value : ''}
          onChange={onChange}
        /> */}

        <input
          autoFocus={false}
          // onBlur={() => onBlur()}
          onChange={e => onChange(e.target.value)}
          type="text"
          value={value ? value : ''}
          className="w-full rounded-xl border-2 border-transparent bg-inherit p-3 text-amber-50 transition    focus:border-amber-50   focus:outline-none"
        />
      </li>
    </ul>
  )
}

export const SettingSwitchContainer = ({children}: {children: ReactNode}) => {
  return <div className="flex flex-col space-y-2">{children}</div>
}
