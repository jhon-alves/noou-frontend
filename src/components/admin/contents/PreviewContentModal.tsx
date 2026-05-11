import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TrainingItem } from "@/services/contents/types"
import { Badge } from "@/components/ui/badge"
import { Chip } from "@/components/shared/Chip"

interface PreviewContentModalProps {
  isOpen: boolean
  content: TrainingItem
  onClose: () => void
}

export function PreviewContentModal({ isOpen, content, onClose }: PreviewContentModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("admin.preview-content")}</DialogTitle>
        </DialogHeader>

        <DialogBody className="text-black dark:text-white pb-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">{t("common.title")}</span>
            <p className="text-sm">{content.title}</p>
          </div>

          <div className="flex flex-col gap-2 items-start">
            <span className="text-sm font-semibold">Status</span>
            {content.is_active ? (
              <Badge className="bg-green-100 text-green-700! hover:bg-green-100 lowercase">
                {t("common.active")}
              </Badge>
            ) : (
              <Badge variant="destructive" className="lowercase">
                {t("common.inactive")}
              </Badge>
            )}
          </div>

          {content?.skills && content?.skills?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{t("common.categories")}</span>
              <div className="flex wrap items-center gap-3">
                {content.skills.map((item) => (
                  <Chip key={item.id} label={item.name} variant="card" size="sm" />
                ))}
              </div>
            </div>
          )}

          {content?.author && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{t("common.author")}</span>
              <p className="text-sm">{content?.author}</p>
            </div>
          )}

          {content?.video_url && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Url</span>
              <p className="text-sm">{content?.video_url}</p>
            </div>
          )}

          {content?.short_description && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{t("common.short-description")}</span>
              <p className="text-sm">{content?.short_description}</p>
            </div>
          )}

          {content?.long_description && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{t("common.long-description")}</span>
              <p className="text-sm">{content?.long_description}</p>
            </div>
          )}

          {content?.sort_order >= 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{t("common.order")}</span>
              <p className="text-sm">{content?.sort_order}</p>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
