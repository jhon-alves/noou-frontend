import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
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
  ContentFormData,
  contentSchema,
  getDefaultContentValues,
  mapContentToFormValues,
  mapFormToTrainingBody,
} from "@/pages/contents/utils/content-form"
import { contentsServices } from "@/services/contents/contents-services"
import { TrainingBody, TrainingItem } from "@/services/contents/types"
import { MultiSelect } from "@/components/shared/MultiSelect"
import { FormContent } from "@/components/shared/FormContent"
import { Switch } from "@/components/shared/Switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/useToast"
import { Input } from "../../ui/input"

interface ContentUpsertModalProps {
  mode: "create" | "edit"
  content?: TrainingItem
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ContentUpsertModal({ mode, content, open, onOpenChange }: ContentUpsertModalProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()

  const defaultValues = getDefaultContentValues()

  const { control, handleSubmit, reset } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    mode: "onBlur",
    defaultValues,
  })

  const titleValue = useWatch({ control, name: "title" })
  const skillsValue = useWatch({ control, name: "skill_ids" })
  const authorValue = useWatch({ control, name: "author" })
  const urlValue = useWatch({ control, name: "video_url" })
  const descValue = useWatch({ control, name: "short_description" })

  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: () => contentsServices.getTrainingSkills(),
  })

  const skillOptions =
    skills?.map((skill) => ({
      id: skill.id,
      label: skill.name,
    })) || []

  useEffect(() => {
    // limpa os campos ao fechar o modal
    if (!open) {
      reset(defaultValues)
      return
    }

    // preenche o form quando abrir o modal
    if (mode === "edit") {
      reset(mapContentToFormValues(content))
      return
    }

    reset(defaultValues)
  }, [open, mode, content, reset])

  const { isPending: loadingUpdate, mutateAsync } = useMutation({
    mutationFn: (body: TrainingBody) => {
      if (mode === "edit") {
        return contentsServices.updateTraining(content.id, body)
      } else if (mode === "create") {
        return contentsServices.createTraining(body)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trainings"] })
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
    !titleValue || skillsValue.length < 1 || !authorValue || !urlValue || !descValue

  const onSubmit = handleSubmit(async (data) => {
    if (requiredFields) return
    const payload = mapFormToTrainingBody(data)
    await mutateAsync(payload)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("admin.new-content") : t("admin.edit-content")}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <FormContent>
            <Label>{t("admin.group-id")}</Label>
            <Controller
              name="group_id"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="group_id"
                  placeholder={t("admin.enter-id")}
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </FormContent>
          <FormContent>
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

          <FormContent>
            <Label isRequired>{t("common.categories")}</Label>
            <Controller
              name="skill_ids"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <MultiSelect
                    options={skillOptions}
                    selectedIds={field.value || []}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("admin.enter-categories")}
                    className="w-full"
                  />
                  {error && <span className="text-xs text-red-400">{error?.message}</span>}
                </div>
              )}
            />
          </FormContent>

          <FormContent>
            <Label isRequired>Video url</Label>
            <Controller
              name="video_url"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="video_url"
                  placeholder={t("admin.enter-url")}
                  error={error?.message}
                  {...field}
                />
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
            <Label isRequired>{t("admin.short-description")}</Label>
            <Controller
              name="short_description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="short_description"
                  placeholder={t("admin.enter-short-desc")}
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </FormContent>

          <FormContent>
            <Label>{t("admin.long-description")}</Label>
            <Controller
              name="long_description"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Textarea
                  id="long_description"
                  placeholder={t("admin.enter-long-desc")}
                  defaultValue={value}
                  onChange={onChange}
                  rows={7}
                />
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

          <div className="flex items-center justify-between gap-2 rounded-xl py-4">
            <Label>Status</Label>
            <Controller
              name="is_active"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch checked={value} onChange={onChange} variant="secondary" />
              )}
            />
          </div>
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
