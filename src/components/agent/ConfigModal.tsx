import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Settings } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useAgentStore } from "@/stores/useAgentStore"
import { useTranslation } from "react-i18next"
import { FormContent } from "../shared/FormContent"

export function ConfigModal() {
  const { t } = useTranslation()
  const { containerId, selectedAgent, sessionId } = useAgentStore()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-3 bg-[#f5f5f5] dark:bg-[#262f45] hover:bg-[#ebebed] dark:hover:bg-[#3d3d48]"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md lg:min-w-165">
        <DialogHeader>
          <DialogTitle>{t("agent.agent-settings")}</DialogTitle>
        </DialogHeader>

        <DialogBody className="pb-6">
          <FormContent>
            <Label>{t("agent.container-id")}</Label>
            <Input disabled defaultValue={containerId ?? ""} />
          </FormContent>

          <FormContent>
            <Label>{t("agent.session-id")}</Label>
            <Input disabled defaultValue={sessionId ?? ""} />
          </FormContent>

          <FormContent>
            <Label>{t("agent.agent-identifier")}</Label>
            <Input disabled defaultValue={selectedAgent?.identifier ?? ""} />
          </FormContent>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
