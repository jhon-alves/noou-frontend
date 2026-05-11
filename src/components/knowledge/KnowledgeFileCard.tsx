import { File, FileText, Folder, Image, Microscope, Palette, Settings, Wand } from "lucide-react"

interface KnowledgeFileCardProps {
  file: {
    id: string
    name: string
    type: string
    size: string
    category: "brand" | "technology" | "design" | "content" | "research"
    uploadDate: string
  }
}

export function KnowledgeFileCard({ file }: KnowledgeFileCardProps) {
  const getFileIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      pdf: <File className="w-5 h-5 text-[#111827] dark:text-white" />,
      svg: <Image className="w-5 h-5 text-[#111827] dark:text-white" />,
      md: <FileText className="w-5 h-5 text-[#111827] dark:text-white" />,
      json: <Settings className="w-5 h-5 text-[#111827] dark:text-white" />,
      docx: <FileText className="w-5 h-5 text-[#111827] dark:text-white" />,
      png: <Image className="w-5 h-5 text-[#111827] dark:text-white" />,
      jpg: <Image className="w-5 h-5 text-[#111827] dark:text-white" />,
    }
    return icons[type] || <File className="w-5 h-5 text-[#111827] dark:text-white" />
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      all: <Folder className="w-4 h-4" />,
      brand: <Palette className="w-4 h-4" />,
      technology: <Settings className="w-4 h-4" />,
      design: <Wand className="w-4 h-4" />,
      content: <FileText className="w-4 h-4" />,
      research: <Microscope className="w-4 h-4" />,
    }
    return iconMap[category] || <File className="w-4 h-4" />
  }

  return (
    <div className="p-6 space-y-4 bg-[#f5f5f5] dark:bg-[#262f45] rounded-2xl hover:scale-[1.02] transition-transform">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-white dark:bg-[#2d2d38] rounded-xl flex items-center justify-center text-2xl shrink-0">
            {getFileIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-[#111827] dark:text-white text-sm truncate"
              title={file.name}
            >
              {file.name}
            </h3>
            <p className="text-xs text-[#666f8d] dark:text-[#9ca3af] mt-1">{file.size}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#2d2d38] text-[#111827] dark:text-white text-xs font-medium rounded-full">
          <span>{getCategoryIcon(file.category)}</span>
          <span>{file.category}</span>
        </span>
        <span className="text-xs text-[#666f8d] dark:text-[#9ca3af]">
          {new Date(file.uploadDate).toLocaleDateString("en-US")}
        </span>
      </div>

      <div className="flex justify-between pt-2 border-t border-[#e3e6ea] dark:border-[#2d2d38]">
        <button className="p-2 hover:bg-white dark:hover:bg-[#2d2d38] rounded-lg transition-colors cursor-pointer">
          <svg
            className="w-4 h-4 text-[#111827] dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        <button className="p-2 hover:bg-[#f9f9f9] dark:hover:bg-[#2d2d38] rounded-lg transition-colors cursor-pointer">
          <svg
            className="w-4 h-4 text-[#111827] dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
        <button className="p-2 text-[#ef4444] hover:bg-[#fef2f2] dark:hover:bg-[#2d1f1f] rounded-lg transition-colors cursor-pointer">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
