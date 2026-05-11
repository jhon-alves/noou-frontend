import { create } from "zustand"

interface TwoFactorStoreProps {
  timer: number
  interval?: NodeJS.Timeout
  setTimer: (timer: number) => void
  startTimer: () => void
  stopTimer: () => void
}

export const useTwoFactorStore = create<TwoFactorStoreProps>((set, get) => ({
  timer: 0,
  interval: undefined,
  setTimer: (v) => set({ timer: v }),
  startTimer: () => {
    const currentInterval = get().interval

    if (currentInterval) {
      clearInterval(currentInterval)
    }

    set({ timer: 60 })

    const interval = setInterval(() => {
      const current = get().timer

      if (current <= 1) {
        clearInterval(interval)
        set({ timer: 0, interval: undefined })
        return
      }

      set({ timer: current - 1 })
    }, 1000)

    set({ interval })
  },

  stopTimer: () => {
    const interval = get().interval
    if (interval) clearInterval(interval)

    set({ interval: undefined, timer: 0 })
  },
}))
