/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getDefaultPromptValues,
  mapFormToPromptBody,
  mapPromptToFormValues,
  PromptFormData,
  promptSchema,
} from "@/pages/prompts/utils/prompt-form"
import { noouAgentsServices } from "@/services/agents/noou-agents-services"
import { PromptBody, PromptItem } from "@/services/prompt/types"
import { MultiSelect } from "@/components/shared/MultiSelect"
import { FormContent } from "@/components/shared/FormContent"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { promptServices } from "@/services"
import { toast } from "@/hooks/useToast"
import { Input } from "../../ui/input"
import { PromptsFormSection } from "./PromptsFormSection"
import { Plus, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { OutputStructureField } from "./OutputStructureField"
import { useBusinessStore } from "@/stores/useBusinessStore"

interface PromptsUpsertModalProps {
  mode: "create" | "edit"
  prompt?: PromptItem
  totalPrompts: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type SectionKey = "basic" | "details" | "command"

const emptyInputBlockItem = {
  key: "",
  label: "",
  placeholder: "",
  type: "input",
}

const emptyOutputStructureItem = {
  section: "",
  items: [""],
}

export function PromptsUpsertModal({
  mode,
  prompt,
  totalPrompts,
  open,
  onOpenChange,
}: PromptsUpsertModalProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const { selectedBusiness } = useBusinessStore()

  const defaultValues = getDefaultPromptValues()
  const staleTime = 1000 * 60 * 5

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    basic: true,
    details: false,
    command: false,
  })

  const { control, handleSubmit, reset, setValue } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    mode: "onBlur",
    defaultValues,
  })

  const [
    title,
    description,
    prompt_template,
    author,
    agent_identifier,
    lang,
    details,
    commandPrompt,
  ] = useWatch({
    control,
    name: [
      "title",
      "description",
      "prompt_template",
      "author",
      "agent_identifier",
      "lang",
      "details",
      "command_prompt",
    ],
  })

  const inputBlockFieldArray = useFieldArray({
    control,
    name: "command_prompt.input_block",
  })

  const outputStructureFieldArray = useFieldArray({
    control,
    name: "command_prompt.output_structure",
  })

  const { data: noouAgents } = useQuery({
    queryKey: ["noou-agents"],
    queryFn: () => noouAgentsServices.getNoouAgents(),
    staleTime,
  })

  const { data: categories } = useQuery({
    queryKey: ["prompt-categories"],
    queryFn: () => promptServices.getPromptCategories(),
    staleTime,
  })

  const categoriesOptions =
    categories?.map((category) => ({
      id: category.name,
      label: category.name,
    })) || []

  const { data: tags } = useQuery({
    queryKey: ["prompt-tags"],
    queryFn: () => promptServices.getPromptTags(),
    staleTime,
  })

  const tagsOptions =
    tags?.map((tag) => ({
      id: tag.name,
      label: tag.name,
    })) || []

  useEffect(() => {
    // limpa os campos ao fechar o modal
    if (!open) {
      reset(defaultValues)
      setOpenSections({
        basic: true,
        details: false,
        command: false,
      })
      return
    }

    // preenche o form quando abrir o modal
    if (mode === "edit") {
      reset(mapPromptToFormValues(prompt))
      setOpenSections({
        basic: true,
        details: false,
        command: false,
      })
      return
    }

    reset(defaultValues)
  }, [open, mode, prompt, reset])

  const { isPending: loadingUpdate, mutateAsync } = useMutation({
    mutationFn: (body: PromptBody) => {
      if (mode === "edit") {
        return promptServices.updatePrompt(prompt.id, body)
      } else if (mode === "create") {
        return promptServices.createPrompt(body)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prompts"] })
      onOpenChange(false)
      toast({
        title: t("common.success"),
        description:
          mode === "create" ? t("admin.content-create-success") : t("admin.content-edit-success"),
        type: "success",
      })
    },
  })

  const requiredFields =
    !title || !description || !prompt_template || !author || !agent_identifier || !lang

  const updateSection = (section: SectionKey, value: boolean) => {
    setOpenSections((current) => ({
      ...current,
      [section]: value,
    }))
  }

  type StringArrayPath =
    | "details.expected_outputs"
    | "details.instructions"
    | "command_prompt.tasks"

  const getStringArrayValue = (path: StringArrayPath) => {
    if (path === "details.expected_outputs") {
      return details?.expected_outputs || []
    }

    if (path === "details.instructions") {
      return details?.instructions || []
    }

    return commandPrompt?.tasks || []
  }

  const addStringItem = (path: StringArrayPath) => {
    const currentValue = getStringArrayValue(path)

    setValue(path, [...currentValue, ""], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const updateStringItem = (path: StringArrayPath, index: number, value: string) => {
    const currentValue = getStringArrayValue(path)
    const nextValue = [...currentValue]

    nextValue[index] = value

    setValue(path, nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const removeStringItem = (path: StringArrayPath, index: number) => {
    const currentValue = getStringArrayValue(path)

    const nextValue = currentValue.filter((_, itemIndex) => itemIndex !== index)

    setValue(path, nextValue.length ? nextValue : [""], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const onSubmit = handleSubmit(async (data) => {
    if (requiredFields) return

    const formData: PromptFormData = {
      ...data,
      business_id: String(selectedBusiness?.id),
      group_id: mode === "create" ? `1_${totalPrompts + 1}` : data.group_id,
    }

    const payload = mapFormToPromptBody(formData)

    await mutateAsync(payload)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("admin.prompts.new-prompt") : t("admin.prompts.edit-prompt")}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {/* Basic */}
          <PromptsFormSection
            index={1}
            title={t("admin.prompts.basic-information")}
            description={t("admin.prompts.basic-information-description")}
            open={openSections.basic}
            onOpenChange={(value) => updateSection("basic", value)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormContent className="lg:col-span-2">
                <Label isRequired>{t("common.title")}</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      id="title"
                      placeholder={t("admin.enter-title")}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </FormContent>

              <FormContent className="lg:col-span-2">
                <Label isRequired>{t("common.description")}</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      id="title"
                      placeholder={t("admin.prompts.enter-description")}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </FormContent>

              <FormContent className="lg:col-span-2">
                <Label isRequired>{t("admin.prompts.prompt-template")}</Label>
                <Controller
                  name="prompt_template"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      id="prompt_template"
                      placeholder={t("admin.prompts.enter-prompt-template")}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </FormContent>

              <FormContent>
                <Label isRequired>{t("admin.prompts.agent")}</Label>
                <Controller
                  name="agent_identifier"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select value={value} onValueChange={(value) => onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.prompts.select-agent")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {noouAgents?.map((agent) => (
                            <SelectItem key={agent.id} value={agent.identifier}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormContent>

              <FormContent>
                <Label isRequired>{t("common.author")}</Label>
                <Controller
                  name="author"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      id="author"
                      placeholder={t("admin.enter-author")}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </FormContent>

              <FormContent>
                <Label>{t("common.categories")}</Label>
                <Controller
                  name="category_names"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <MultiSelect
                        options={categoriesOptions}
                        selectedIds={field.value || []}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={t("admin.prompts.select-categories")}
                        className="w-full"
                      />
                      {error && <span className="text-xs text-red-400">{error?.message}</span>}
                    </div>
                  )}
                />
              </FormContent>

              <FormContent>
                <Label>Tags</Label>
                <Controller
                  name="tag_names"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <MultiSelect
                        options={tagsOptions}
                        selectedIds={field.value || []}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder={t("admin.prompts.select-tags")}
                        className="w-full"
                      />
                      {error && <span className="text-xs text-red-400">{error?.message}</span>}
                    </div>
                  )}
                />
              </FormContent>

              <FormContent>
                <Label>{t("admin.prompts.visibility")}</Label>
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select value={value} onValueChange={(value) => onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.prompts.select-visibility")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="PUBLIC">
                            {t("admin.prompts.visibility-public")}
                          </SelectItem>
                          <SelectItem value="PRIVATE">
                            {t("admin.prompts.visibility-private")}
                          </SelectItem>
                          <SelectItem value="CORPORATION">
                            {t("admin.prompts.visibility-corporation")}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormContent>

              <FormContent>
                <Label>{t("admin.lang")}</Label>
                <Controller
                  name="lang"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select value={value} onValueChange={(value) => onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("admin.enter-lang")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="en">{t("common.english")}</SelectItem>
                          <SelectItem value="pt">{t("common.portuguese")}</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormContent>

              <FormContent>
                <Label>{t("common.order")}</Label>
                <Controller
                  name="sort_order"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      id="sort_order"
                      placeholder={t("admin.enter-order")}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </FormContent>
            </div>
          </PromptsFormSection>
          {/* Details */}
          <PromptsFormSection
            index={2}
            title={t("admin.prompts.prompt-details")}
            description={t("admin.prompts.prompt-details-description")}
            open={openSections.details}
            onOpenChange={(value) => updateSection("details", value)}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormContent>
                <Label isRequired>{t("admin.prompts.context")}</Label>

                <Controller
                  name="details.context"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Textarea
                      id="context"
                      placeholder={t("admin.prompts.enter-context")}
                      className="min-h-32"
                      defaultValue={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormContent>

              <FormContent>
                <Label isRequired>{t("admin.prompts.objective")}</Label>

                <Controller
                  name="details.objective"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Textarea
                      id="objective"
                      placeholder={t("admin.prompts.enter-objective")}
                      className="min-h-32"
                      defaultValue={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormContent>

              <FormContent className="lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label isRequired>{t("admin.prompts.expected-outputs")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addStringItem("details.expected_outputs")}
                  >
                    <Plus className="mr-2 size-4" />
                    {t("common.add")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {(details?.expected_outputs?.length ? details.expected_outputs : [""]).map(
                    (value, index) => (
                      <div key={`expected-output-${index}`} className="flex gap-2">
                        <Input
                          value={value}
                          placeholder={t("admin.prompts.enter-expected-output")}
                          onChange={(event) =>
                            updateStringItem("details.expected_outputs", index, event.target.value)
                          }
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={(details?.expected_outputs?.length || 0) <= 1}
                          onClick={() => removeStringItem("details.expected_outputs", index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </FormContent>

              <FormContent className="lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label isRequired>{t("admin.prompts.instructions")}</Label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addStringItem("details.instructions")}
                  >
                    <Plus className="mr-2 size-4" />
                    {t("common.add")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {(details?.instructions?.length ? details.instructions : [""]).map(
                    (value, index) => (
                      <div key={`instruction-${index}`} className="flex gap-2">
                        <Input
                          value={value}
                          placeholder={t("admin.prompts.enter-instruction")}
                          onChange={(event) =>
                            updateStringItem("details.instructions", index, event.target.value)
                          }
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={(details?.instructions?.length || 0) <= 1}
                          onClick={() => removeStringItem("details.instructions", index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </FormContent>
            </div>
          </PromptsFormSection>
          {/* Command */}
          <PromptsFormSection
            index={3}
            title={t("admin.prompts.prompt-command")}
            description={t("admin.prompts.prompt-command-description")}
            open={openSections.command}
            onOpenChange={(value) => updateSection("command", value)}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormContent className="lg:col-span-2">
                <Label isRequired>{t("common.title")}</Label>

                <Controller
                  name="command_prompt.title"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      id="command_prompt_title"
                      placeholder={t("admin.enter-title")}
                      error={error?.message}
                      {...field}
                    />
                  )}
                />
              </FormContent>

              <FormContent className="lg:col-span-2">
                <Label isRequired>{t("admin.prompts.command")}</Label>

                <Controller
                  name="command_prompt.command"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Textarea
                      id="command_prompt_command"
                      placeholder={t("admin.prompts.enter-command")}
                      className="min-h-32"
                      defaultValue={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormContent>

              <FormContent className="lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label isRequired>{t("admin.prompts.tasks")}</Label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addStringItem("command_prompt.tasks")}
                  >
                    <Plus className="mr-2 size-4" />
                    {t("common.add")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {(commandPrompt?.tasks?.length ? commandPrompt.tasks : [""]).map(
                    (value, index) => (
                      <div key={`task-${index}`} className="flex gap-2">
                        <Input
                          value={value}
                          placeholder={t("admin.prompts.enter-task")}
                          onChange={(event) =>
                            updateStringItem("command_prompt.tasks", index, event.target.value)
                          }
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStringItem("command_prompt.tasks", index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </FormContent>

              <FormContent className="lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label isRequired>{t("admin.prompts.input-block")}</Label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputBlockFieldArray.append(emptyInputBlockItem)}
                  >
                    <Plus className="mr-2 size-4" />

                    {t("common.add")}
                  </Button>
                </div>

                <div className="space-y-4">
                  {inputBlockFieldArray.fields.map((field, index) => (
                    <div key={field.id} className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-sm text-black dark:text-white font-medium">
                          {t("admin.prompts.input-field")} {index + 1}
                        </p>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => inputBlockFieldArray.remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Controller
                          name={`command_prompt.input_block.${index}.key`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <Input
                              placeholder={t("admin.prompts.enter-input-key")}
                              error={error?.message}
                              {...field}
                            />
                          )}
                        />

                        <Controller
                          name={`command_prompt.input_block.${index}.label`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <Input
                              placeholder={t("admin.prompts.enter-input-label")}
                              error={error?.message}
                              {...field}
                            />
                          )}
                        />

                        <Controller
                          name={`command_prompt.input_block.${index}.placeholder`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <Input
                              placeholder={t("admin.prompts.enter-input-placeholder")}
                              error={error?.message}
                              {...field}
                            />
                          )}
                        />

                        <Controller
                          name={`command_prompt.input_block.${index}.type`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Select value={value} onValueChange={onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder={t("admin.prompts.select-input-type")} />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="input">input</SelectItem>
                                  <SelectItem value="textarea">textarea</SelectItem>
                                  <SelectItem value="select">select</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </FormContent>

              <FormContent className="lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label isRequired>{t("admin.prompts.output-structure")}</Label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => outputStructureFieldArray.append(emptyOutputStructureItem)}
                  >
                    <Plus className="mr-2 size-4" />
                    {t("common.add")}
                  </Button>
                </div>

                <div className="space-y-4">
                  {outputStructureFieldArray.fields.map((field, index) => (
                    <OutputStructureField
                      key={field.id}
                      control={control}
                      setValue={setValue}
                      outputStructure={commandPrompt?.output_structure || []}
                      index={index}
                      onRemove={() => outputStructureFieldArray.remove(index)}
                    />
                  ))}
                </div>
              </FormContent>
            </div>
          </PromptsFormSection>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button isLoading={loadingUpdate} disabled={requiredFields} onClick={onSubmit}>
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
