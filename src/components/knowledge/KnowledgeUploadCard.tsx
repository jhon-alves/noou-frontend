import { useTranslation } from "react-i18next"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

// interface KnowledgeUploadCardProps extends PropsWithChildren {
//   file?: []
// }

export function KnowledgeUploadCard() {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        "bg-[#f5f5f5] dark:bg-[#262f45] rounded-3xl p-12 text-center border-2 border-dashed transition-colors",
        "border-[#e3e6ea] dark:border-[#2d2d38]",
        // "hover:border-[#111827] dark:hover:border-white cursor-pointer"
      )}
    >
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-[#f9f9f9] dark:bg-[#2d2d38] rounded-full flex items-center justify-center">
          <Upload className="w-7 h-7 text-[#111827] dark:text-white" />
        </div>
        <div>
          <p className="text-lg text-[#111827] dark:text-white font-medium">
            {t("knowledge.drag-drop")}
          </p>
          <p className="text-sm text-[#666f8d] dark:text-[#9ca3af]">
            PDF, SVG, PNG, JPG, MD, JSON, DOCX (max 10MB)
          </p>
        </div>
      </div>
      {/* {children} */}
    </div>
  )
}
