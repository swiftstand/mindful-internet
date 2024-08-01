import {BreathingLabel} from '@types'
import {BreathingPattern} from './index'
import {BREATHING_COLORS} from './colors'

const times = [0, 0.5, 1]
const scale = [1, 1.3]
const borderColorInterval = ` ${BREATHING_COLORS.in} 0%,
                 ${BREATHING_COLORS.in} 40%,
                 ${BREATHING_COLORS.hold} 40%,
                 ${BREATHING_COLORS.hold} 60%,
                 ${BREATHING_COLORS.out} 60%,
                 ${BREATHING_COLORS.out} 100%`

const getBreathingLabel = (durationPassed: number): BreathingLabel => {
  if (durationPassed <= 2) {
    return 'Countdown'
  }

  throw new Error(
    `Outside out expected duration passed was "${durationPassed}"`,
  )
}

const patternLabelInfos: BreathingPattern['patternLabelInfos'] = [
  [100, 'Countdown'],
]

const patternSecondsInfos: BreathingPattern['patternSecondsInfos'] = [[100, 2]]

export const breathing2: BreathingPattern = {
  name: '2',
  times,
  scale,
  borderColorInterval,
  duration: 2,
  patternLabelInfos,
  patternSecondsInfos,
  getBreathingLabel,
}
