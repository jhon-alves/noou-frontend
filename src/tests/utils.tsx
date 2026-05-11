/* eslint-disable react-refresh/only-export-components */
import { vi } from "vitest"
import { ReactElement } from "react"
import { BrowserRouter, MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render as rtlRender, RenderOptions } from "@testing-library/react"

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })
}

type CustomRenderOptions = RenderOptions & {
  route?: string
  withBrowserRouter?: boolean
}

export function render(
  ui: ReactElement,
  { route = "/", withBrowserRouter = false, ...options }: CustomRenderOptions = {},
) {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const Router = withBrowserRouter ? BrowserRouter : MemoryRouter

    return (
      <QueryClientProvider client={queryClient}>
        <Router initialEntries={[route]}>{children}</Router>
      </QueryClientProvider>
    )
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options })
}

export * from "@testing-library/react"
export { default as userEvent } from "@testing-library/user-event"
export { vi }
