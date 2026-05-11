import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { queryClient } from "./utils/queryClient"
import { AppRoutes } from "@/routes/AppRoutes"
import { SidebarProvider } from "./contexts/SidebarProvider"

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors position="bottom-right" />
      <BrowserRouter>
        <SidebarProvider>
          <AppRoutes />
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)

export default App
