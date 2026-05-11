import { useTranslation } from "react-i18next"
import { Chip } from "../shared/Chip"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"
import { PromptItem } from "@/services/prompt/types"
import { useAgentStore } from "@/stores/useAgentStore"
import { useMutation } from "@tanstack/react-query"
import { promptServices } from "@/services"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Checkbox } from "../shared/Checkbox"

interface PromptInputsProps {
  prompt: PromptItem
}

export function PromptInputs({ prompt }: PromptInputsProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [acceptTerm, setAcceptTerm] = useState<boolean>(false)

  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const { containerStatus, setSelectedAgent, setPromptTemplate, setStartContainerModal } =
    useAgentStore()

  // Transforma \n em quebra real e remove excesso de linhas
  function formatToMarkdown(text?: string) {
    return text
      ?.replace(/\\n/g, "\n")
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .trim()
  }

  const { isPending: loadingGeneratePrompt, mutateAsync } = useMutation({
    mutationFn: (body: Record<string, string>) => promptServices.generatePrompt(prompt.id, body),
    onSuccess: (data) => {
      setPromptTemplate(formatToMarkdown(data.prompt_template))
      setSelectedAgent({
        identifier: prompt.agent.identifier,
        name: prompt.agent.name,
      })
      navigate("/agent")

      if (containerStatus !== "active") {
        return setStartContainerModal(true)
      }
    },
  })

  async function handleUsePrompt() {
    await mutateAsync(formValues)
  }

  function handleChange(key: string, value: string) {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
          {prompt?.command_prompt?.title}
        </h2>
        <p className="text-sm text-[#666f8d] dark:text-[#9ca3af] mb-3">{prompt?.description}</p>

        {prompt?.categories && prompt?.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {prompt?.categories.map((c) => (
              <Chip key={c.id} variant="filter" size="sm" label={c.name} />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Input Block */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#111827] dark:text-white uppercase">
          {t("prompts.prompt-input-block")}
        </h3>

        {/* Input Fields */}
        <div className="space-y-4">
          {prompt?.command_prompt?.input_block.map((item) => (
            <div key={item.key}>
              <Label className="block text-xs font-semibold text-[#666f8d] dark:text-[#9ca3af] mb-2">
                {item.label}
              </Label>
              <Input
                type="text"
                name={item.key}
                placeholder={item.placeholder}
                value={formValues[item.key] || ""}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-500 rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox size="small" checked={acceptTerm} onChange={() => setAcceptTerm(!acceptTerm)} />
        <p className="text-neutral-900 dark:text-white text-sm">
          I agree to the{" "}
          <Link to="/privacy-policy" className="underline">
            terms and policies
          </Link>
        </p>
      </div>

      <Button
        className="w-full pt-4"
        disabled={!acceptTerm}
        isLoading={loadingGeneratePrompt}
        onClick={handleUsePrompt}
      >
        {t("prompts.use-prompt")}
      </Button>
    </>
  )
}
