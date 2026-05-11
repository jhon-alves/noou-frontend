import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowRight, Heart } from "lucide-react"
import { PromptItem } from "@/services/prompt/types"
import { toast } from "@/hooks/useToast"
import { promptServices } from "@/services"
import promptImg from "@/assets/images/prompt-image.png"
import { Card, CardDescription, CardTitle } from "../ui/card"
import { PromptDrawer } from "./PromptDrawer"
import { cn } from "@/lib/utils"
import { Chip } from "../shared/Chip"

interface PromptCardProps {
  prompt: PromptItem
  isDash?: boolean
  onClick?: () => void
}

export function PromptCard({ prompt, isDash = false }: PromptCardProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const [liked, setLiked] = useState(prompt.has_hearted)
  const [openDrawer, setOpenDrawer] = useState(false)

  const likeMutation = useMutation({
    mutationFn: (willLike: boolean) =>
      willLike ? promptServices.removeLike(prompt.id) : promptServices.addLike(prompt.id),
    onMutate: async (willLike) => {
      // 1 Cancela requisições em andamento que afetam a lista de prompts
      await qc.cancelQueries({ queryKey: ["prompts"] })
      // 2 Snapshot do estado anterior
      const previousData = qc.getQueryData(["prompts"])
      // 3 Atualiza visualmente
      setLiked(!willLike)
      // Retorna o estado anterior para possível rollback
      return { previousData }
    },
    onSuccess: (_, willLike) => {
      toast({
        title: t("common.success"),
        description: !willLike ? t("prompts.liked-prompt") : t("prompts.like-removed"),
        type: "success",
      })
    },
    onSettled: () => {
      // Atualiza dados finais do servidor
      qc.invalidateQueries({ queryKey: ["prompts"] })
    },
  })

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation()
    likeMutation.mutateAsync(liked)
  }

  function handleUsePrompt() {
    setOpenDrawer(true)
  }

  return (
    <>
      <PromptDrawer
        open={openDrawer}
        onOpenChange={(value) => setOpenDrawer(value)}
        prompt={prompt}
      />

      <Card
        className={cn(
          "flex flex-col transition-all duration-300 group",
          isDash && "cursor-pointer",
        )}
        onClick={isDash ? handleUsePrompt : undefined}
      >
        <div className="relative h-34.5 overflow-hidden">
          <img
            src={promptImg}
            alt="prompt img"
            className="inset-0 z-0 h-full w-full object-cover"
          />
          {!isDash && (
            <div className="absolute top-1 right-2 hidden group-hover:flex justify-end p-4 transition-all duration-300">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 h-8 px-2 bg-black/20 rounded-full cursor-pointer ${
                  liked ? "text-red-400" : "text-white"
                }`}
              >
                <Heart size={16} className={liked ? "fill-current" : ""} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 p-6">
          <div className="flex flex-col gap-4">
            {prompt.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {prompt.categories.slice(0, 2).map((cat) => (
                  <Chip key={cat.id} label={cat.name} variant="card" size="xs" />
                ))}
                {prompt.categories.length > 2 && (
                  <span className={`text-[11px] dark:text-gray-300 text-[#666f8d]`}>
                    +{prompt.categories.length - 2}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2">
              <CardTitle>{prompt.title}</CardTitle>
              <CardDescription>{prompt.description}</CardDescription>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-1.5 self-start bg-black dark:bg-white rounded-full px-3 py-1 cursor-pointer"
              onClick={handleUsePrompt}
            >
              <span className="text-xs text-white dark:text-black leading-5 font-medium">
                {t("prompts.interact")}
              </span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </Card>
    </>
  )
}
