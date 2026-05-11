import { useState } from "react"
import { DrawerClose, DrawerHeader } from "../ui/drawer"
import { ChevronLeft, X } from "lucide-react"
import img from "@/assets/images/prompt-image.png"
import { PromptItem } from "@/services/prompt/types"
import { DrawerLayout, DrawerBody } from "../shared/Drawer"
import { PromptInputs } from "./PromptInputs"
import { PromptDetails } from "./PromptDetails"

interface PromptDrawerProps {
  open: boolean
  prompt: PromptItem
  onOpenChange: (drawer: boolean) => void
}

export function PromptDrawer({ open, prompt, onOpenChange }: PromptDrawerProps) {
  const [view, setView] = useState<"details" | "inputs">("details")

  return (
    <DrawerLayout open={open} onOpenChange={onOpenChange}>
      <DrawerHeader className="relative h-48 shrink-0">
        <img src={img} alt="Prompt image" className=" w-full h-full object-cover" />

        {view === "inputs" && (
          <button
            className="absolute top-4 left-4 z-10 size-10 rounded-full flex items-center justify-center bg-white/20 dark:bg-white/20 hover:bg-white/20 dark:hover:bg-[#3d3d48] transition-colors cursor-pointer"
            onClick={() => setView("details")}
          >
            <ChevronLeft className="text-[#111827] dark:text-white" />
          </button>
        )}

        <DrawerClose asChild>
          <button className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm cursor-pointer">
            <X className="size-6 text-white" />
          </button>
        </DrawerClose>
      </DrawerHeader>

      <DrawerBody className="scrollbar">
        {view === "details" ? (
          <PromptDetails prompt={prompt} onContinue={() => setView("inputs")} />
        ) : (
          <PromptInputs prompt={prompt} />
        )}
      </DrawerBody>
    </DrawerLayout>
  )
}
