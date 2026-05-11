import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PromptFormData } from "@/pages/prompts/utils/prompt-form"
import { Plus, Trash2 } from "lucide-react"
import { Control, Controller, UseFormSetValue } from "react-hook-form"
import { useTranslation } from "react-i18next"

interface OutputStructureFieldProps {
  control: Control<PromptFormData>
  setValue: UseFormSetValue<PromptFormData>
  outputStructure: PromptFormData["command_prompt"]["output_structure"]
  index: number
  onRemove: () => void
}

export function OutputStructureField({
  control,
  setValue,
  outputStructure,
  index,
  onRemove,
}: OutputStructureFieldProps) {
  const { t } = useTranslation()

  const currentItems = outputStructure[index]?.items?.length ? outputStructure[index].items : [""]

  const updateItems = (items: string[]) => {
    setValue(`command_prompt.output_structure.${index}.items`, items, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const addItem = () => {
    updateItems([...currentItems, ""])
  }

  const updateItem = (itemIndex: number, value: string) => {
    const nextItems = [...currentItems]
    nextItems[itemIndex] = value
    updateItems(nextItems)
  }

  const removeItem = (itemIndex: number) => {
    const nextItems = currentItems.filter((_, currentIndex) => currentIndex !== itemIndex)
    updateItems(nextItems.length ? nextItems : [""])
  }

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-black dark:text-white font-medium">
          {t("admin.section", "Section")} {index + 1}
        </p>

        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <Controller
          name={`command_prompt.output_structure.${index}.section`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              placeholder={t("admin.enter-section-name", "Enter section name")}
              error={error?.message}
              {...field}
            />
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label>{t("admin.items", "Items")}</Label>

            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 size-4" />
              {t("common.add")}
            </Button>
          </div>

          {currentItems.map((value, itemIndex) => (
            <div key={`output-item-${index}-${itemIndex}`} className="flex gap-2">
              <Input
                value={value}
                placeholder={t("admin.enter-item", "Enter item")}
                onChange={(event) => updateItem(itemIndex, event.target.value)}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={currentItems.length <= 1}
                onClick={() => removeItem(itemIndex)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
