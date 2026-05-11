import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import { PromptItem } from "@/services/prompt/types"

interface PromptDetailsProps {
  prompt: PromptItem
  onContinue: () => void
}

export function PromptDetails({ prompt, onContinue }: PromptDetailsProps) {
  const { t } = useTranslation()

  const context = prompt.details?.context?.trim()
  const objective = prompt.details?.objective?.trim()
  const instructions = prompt.details?.instructions ?? []
  const expectedOutputs = prompt.details?.expected_outputs ?? []

  return (
    <>
      <div className="space-y-4">
        <h1 className="font-bold text-[24px] md:text-[28px] text-[#111827] dark:text-white leading-[1.2]">
          {prompt.title}
        </h1>
        <p className="text-sm text-[#666f8d] dark:text-[#9ca3af] mb-3">{prompt?.description}</p>
      </div>

      {/* Conteúdo Principal - Detalhes */}
      <div className="space-y-7 border-b border-b-gray-500 pb-8">
        {context && (
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-[14px] text-[#111827] dark:text-white tracking-wide">
              {t("common.context").toUpperCase()}
            </h2>
            <p className="text-[15px] text-[#666f8d] dark:text-[#9ca3af] leading-[1.7]">
              {context}
            </p>
          </div>
        )}

        {objective && (
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-[14px] text-[#111827] dark:text-white tracking-wide">
              {t("common.objective").toUpperCase()}
            </h2>
            <p className="text-[15px] text-[#666f8d] dark:text-[#9ca3af] leading-[1.7]">
              {objective}
            </p>
          </div>
        )}

        {instructions?.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-[14px] text-[#111827] dark:text-white tracking-wide">
              {t("common.instructions").toUpperCase()}
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
              {t("common.deliverables").toUpperCase()}
            </h2>
            <ul className="list-none">
              {expectedOutputs.map((item, index) => (
                <li
                  key={item}
                  className={`text-[15px] text-[#666f8d] dark:text-[#9ca3af] leading-[1.7] bg-neutral-100 dark:bg-neutral-500 rounded-2xl p-4 ${
                    index !== expectedOutputs.length - 1 ? "mb-3" : ""
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Button className="w-full pt-4" onClick={onContinue}>
        Continue
      </Button>
    </>
  )
}
