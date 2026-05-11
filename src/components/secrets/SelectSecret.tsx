import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"
import { SecretKeysData } from "@/services/secrets/types"
import { useTranslation } from "react-i18next"

interface SelectSecretProps {
  value: string
  keys: SecretKeysData[]
  onChange: (value: string) => void
}

export function SelectSecret({ keys, value, onChange }: SelectSecretProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const selectedKey = keys.find((item) => item.key === value)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-between gap-3 border border-[#9ca3af]/20 bg-background px-4 py-3.5 rounded-full cursor-pointer">
          {selectedKey ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-start gap-1">
                <p className="text-sm font-semibold text-white">{selectedKey.key}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">{t("secrets.enter-key")}</p>
          )}

          <ChevronDown
            className={cn(
              "text-white size-4 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="bg-background border dark:border-[#2d2d38]">
        <div className="flex flex-col gap-2">
          {keys.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => {
                onChange(item.key)
                setOpen(false)
              }}
              className="flex items-center justify-between gap-6 px-4 py-3.5"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start gap-1">
                  <p className="text-sm font-semibold text-white">{item.key}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              {item.key === value && <Check className="text-white size-4" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
