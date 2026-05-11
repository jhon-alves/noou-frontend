type EventHandler<T = any> = (data?: T) => void

class ContainerPubSub {
  private events: Record<string, EventHandler[]> = {}

  subscribe<T = any>(event: string, handler: EventHandler<T>) {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(handler)

    return () => {
      this.unsubscribe(event, handler)
    }
  }

  unsubscribe(event: string, handler: EventHandler) {
    const handlers = this.events[event]

    if (!handlers) return

    this.events[event] = handlers.filter((h) => h !== handler)
  }

  publish<T = any>(event: string, data?: T) {
    const handlers = this.events[event]

    if (!handlers) return

    handlers.forEach((handler) => handler(data))
  }
}

export const containerPubSub = new ContainerPubSub()
