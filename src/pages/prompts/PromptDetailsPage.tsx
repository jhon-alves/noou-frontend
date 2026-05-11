import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSuspenseQuery } from "@tanstack/react-query"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { PageHeader } from "@/components/shared/PageHeader"
import { Chip } from "@/components/shared/Chip"
import { Button } from "@/components/ui/button"
import { promptServices } from "@/services"
import { PromptDrawer } from "@/components/prompts/PromptDrawer"
import { useState } from "react"

const PromptDetailsPage = () => {
  const { promptId } = useParams()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language || "en"
  const [openDrawer, setOpenDrawer] = useState(false)

  const { data: prompt } = useSuspenseQuery({
    queryKey: ["prompt-details", promptId, currentLanguage],
    queryFn: () => promptServices.getPromptByGroup(promptId, currentLanguage),
  })

  const context = prompt.details?.context?.trim()
  const objective = prompt.details?.objective?.trim()
  const instructions = prompt.details?.instructions ?? []
  const expectedOutputs = prompt.details?.expected_outputs ?? []
  const categories = prompt.categories ?? []

  return (
    <PageWrapper>
      <PageHeader
        title="Prompt Details"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Prompts Library", href: "/prompts" },
          { label: "Prompt Details" },
        ]}
      />

      <PromptDrawer
        open={openDrawer}
        onOpenChange={(value) => setOpenDrawer(value)}
        prompt={prompt}
      />

      <div className="max-w-6xl w-full mx-auto px-6 md:px-10 space-y-8 pb-8 pt-0">
        <div
          className={`relative bg-[linear-gradient(to_right,#4210b1,#aa0057)] rounded-2xl h-40 overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)",
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-bold text-[24px] md:text-[28px] text-[#111827] dark:text-white leading-[1.2]">
            {prompt.title}
          </h1>

          {categories?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Chip key={c.id} variant="filter" size="sm" label={c.name} />
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo Principal - Detalhes */}
        <div className="space-y-7 border-b border-b-gray-500 pb-8">
          {context && (
            <div className="flex flex-col gap-1">
              <h2 className="font-bold text-[14px] text-[#111827] dark:text-white tracking-wide">
                {t("common.context")}
              </h2>
              <p className="text-[15px] text-[#666f8d] dark:text-[#9ca3af] leading-[1.7]">
                {context}
              </p>
            </div>
          )}

          {objective && (
            <div className="flex flex-col gap-1">
              <h2 className="font-bold text-[14px] text-[#111827] dark:text-white tracking-wide">
                {t("common.objective")}
              </h2>
              <p className="text-[15px] text-[#666f8d] dark:text-[#9ca3af] leading-[1.7]">
                {objective}
              </p>
            </div>
          )}

          {instructions?.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-[14px] text-[#111827] dark:text-white tracking-wide">
                {t("common.instructions")}
              </h2>
              <ul className="list-disc">
                {instructions.map((item) => (
                  <li
                    key={item}
                    className="text-[15px] text-[#666f8d] dark:text-[#9ca3af] leading-[1.7] ml-7"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expectedOutputs?.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-[14px] text-[#111827] dark:text-white tracking-wide">
                {t("common.deliverables")}
              </h2>
              <ul className="list-disc">
                {expectedOutputs.map((item) => (
                  <li
                    key={item}
                    className="text-[15px] text-[#666f8d] dark:text-[#9ca3af] leading-[1.7] ml-7"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end gap-3">
          <Button onClick={() => setOpenDrawer(true)}>{t("prompts.interact")}</Button>
        </div>
      </div>
    </PageWrapper>
  )
}

export default PromptDetailsPage
