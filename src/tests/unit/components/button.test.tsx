import { describe, test, expect, vi } from "vitest"
import { screen, render, userEvent } from "@/tests/utils"
import { Button } from "@/components/ui/button"

describe("<Button />", () => {
  test("renderiza children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  test("chama onClick quando clicado", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)

    await userEvent.click(screen.getByText("Click"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("fica disabled quando prop disabled é passada", () => {
    render(<Button disabled>Disabled</Button>)
    const btn = screen.getByRole("button", { name: "Disabled" })
    expect(btn).toBeDisabled()
  })
})
