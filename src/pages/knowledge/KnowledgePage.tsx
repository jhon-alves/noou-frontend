/* eslint-disable */
import { useState } from "react"
import {
  Folder,
  Palette,
  Settings,
  Wand,
  FileText,
  Microscope,
  ChartBar,
  Calendar,
  Sparkles,
} from "lucide-react"
import { KnowledgeStatsCard } from "@/components/knowledge/KnowledgeStatsCard"
import { KnowledgeCategoryFilterCard } from "@/components/knowledge/KnowledgeCategoryFilterCard"
import { KnowledgeFileCard } from "@/components/knowledge/KnowledgeFileCard"
import { KnowledgeUploadCard } from "@/components/knowledge/KnowledgeUploadCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { useTranslation } from "react-i18next"

interface FileItem {
  id: string
  name: string
  type: string
  size: string
  category: "brand" | "technology" | "design" | "content" | "research"
  uploadDate: string
}

export default function KnowledgePage() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Brand Guidelines 2025.pdf",
      type: "pdf",
      size: "2.4 MB",
      category: "brand",
      uploadDate: "2025-01-10",
    },
    {
      id: "2",
      name: "Logo_Noou_Final.svg",
      type: "svg",
      size: "156 KB",
      category: "brand",
      uploadDate: "2025-01-09",
    },
    {
      id: "3",
      name: "Coding_Standards.md",
      type: "md",
      size: "45 KB",
      category: "technology",
      uploadDate: "2025-01-08",
    },
    {
      id: "4",
      name: "Design_System_Tokens.json",
      type: "json",
      size: "89 KB",
      category: "design",
      uploadDate: "2025-01-07",
    },
    {
      id: "5",
      name: "User_Research_Report.docx",
      type: "docx",
      size: "3.2 MB",
      category: "research",
      uploadDate: "2025-01-06",
    },
  ])

  const filteredFiles =
    selectedCategory === "all" ? files : files.filter((f) => f.category === selectedCategory)

  const categories = [
    { id: "all", label: t("common.all"), icon: Folder, count: files.length },
    {
      id: "brand",
      label: t("common.brand"),
      icon: Palette,
      count: files.filter((f) => f.category === "brand").length,
    },
    {
      id: "technology",
      label: t("common.technology"),
      icon: Settings,
      count: files.filter((f) => f.category === "technology").length,
    },
    {
      id: "design",
      label: t("common.design"),
      icon: Wand,
      count: files.filter((f) => f.category === "design").length,
    },
    {
      id: "content",
      label: t("common.content"),
      icon: FileText,
      count: files.filter((f) => f.category === "content").length,
    },
    {
      id: "research",
      label: t("common.research"),
      icon: Microscope,
      count: files.filter((f) => f.category === "research").length,
    },
  ]

  const stats = [
    {
      id: 1,
      icon: ChartBar,
      title: t("knowledge.total-files"),
      value: 5,
    },
    {
      id: 2,
      icon: Calendar,
      title: t("knowledge.last-updated"),
      value: "10/01/2025",
    },
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    console.log("Files dropped:", e.dataTransfer.files)
  }

  return (
    <PageWrapper>
      <PageHeader
        title={t("knowledge.title")}
        subtitle={t("knowledge.subtitle")}
        hasRefresh={false}
        breadcrumbs={[
          { label: t("nav.home"), href: "/dashboard" },
          { label: t("knowledge.title") },
        ]}
      />
      {/* <Button>
          <Plus className="size-4" />
          {t('knowledge.upload-file')}
        </Button>
      </PageHeader> */}

      <div className="flex gap-2.5 p-5 rounded-2xl bg-transparent border-[0.5px] border-gray-400 dark:border-gray-600">
        <div className="text-[#FF0F93]">
          <Sparkles size={14} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-sm text-black dark:text-white font-semibold">{t("common.soon")}</h1>
          <p className="text-sm text-gray-400">{t("common.soon-message")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <KnowledgeStatsCard key={stat.id} stat={stat} />
        ))}
      </div>

      <KnowledgeUploadCard
      // onDragEnter={handleDrag}
      // onDragLeave={handleDrag}
      // onDragOver={handleDrag}
      // onDrop={handleDrop}
      />

      <div>
        <h2 className="text-lg font-semibold text-[#111827] dark:text-white mb-4">
          {t("common.categories")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => (
            <KnowledgeCategoryFilterCard
              key={category.id}
              category={category}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <KnowledgeFileCard key={file.id} file={file} />
        ))}
      </div>
    </PageWrapper>
  )
}
