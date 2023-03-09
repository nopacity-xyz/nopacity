export type VotingPeriod = 'weeks' | 'days' | 'hours' | 'minutes'

export const timeInSeconds = (
  quantity: number,
  period: VotingPeriod
): number => {
  let result: number

  switch (period) {
    case 'weeks': {
      result = quantity * 7 * 24 * 60 * 60
      break
    }
    case 'days': {
      result = quantity * 24 * 60 * 60
      break
    }
    case 'hours': {
      result = quantity * 60 * 60
      break
    }
    case 'minutes': {
      result = quantity * 60
      break
    }
  }

  return result
}
