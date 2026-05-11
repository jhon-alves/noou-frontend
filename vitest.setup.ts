import "@testing-library/jest-dom/vitest"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// Limpa o DOM a cada teste
afterEach(() => {
  cleanup()
})

// Mock de i18n para não depender do setup real nos testes
vi.mock("react-i18next", async () => {
  const actual = await vi.importActual<any>("react-i18next")
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { changeLanguage: () => Promise.resolve() },
    }),
    Trans: (props: any) => props.children,
  }
})

// Mock para window.matchMedia (muitos componentes quebram sem isso)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
