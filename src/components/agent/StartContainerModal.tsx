/* eslint-disable react-hooks/set-state-in-effect */
import { RefObject, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { stopContainerHealthSocket } from "@/pages/agent/hooks/startContainerHealthSocket"
import { ContainerStatus, useAgentStore } from "@/stores/useAgentStore"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { XIcon } from "lucide-react"
import connectingImg from "@/assets/images/connecting-ws-illustration.svg"
import creatingImg from "@/assets/images/creating-illustration.svg"
import activeImg from "@/assets/images/active-illustration.svg"

interface StartContainerModalProps {
  abortStartContainerRef: RefObject<AbortController>
}

export function StartContainerModal({ abortStartContainerRef }: StartContainerModalProps) {
  const { t } = useTranslation()
  const { containerStatus, startContainerModal, resetContainer, setStartContainerModal } =
    useAgentStore()
  const [confirmAbortModal, setConfirmAbortModal] = useState(false)
  const [connectingTextIndex, setConnectingTextIndex] = useState(0)

  // Verifica se o status atual já é um dos status de inicialização/ativo
  const isContainerStarted = ["creating", "connecting-ws", "active"].includes(containerStatus)

  // Se não estiver iniciado (independente de qual seja o status padrão no seu store), força "creating"
  const visualStatus = isContainerStarted ? containerStatus : "creating"

  const shouldShowStatus = ["creating", "connecting-ws", "active"].includes(visualStatus)
  const isProcessing = ["creating", "connecting-ws"].includes(visualStatus)

  // Quando o status do container for active, aguarda 2s para fechar o modal
  useEffect(() => {
    if (!startContainerModal || containerStatus !== "active") return

    const timeout = window.setTimeout(() => {
      setStartContainerModal(false)
    }, 2000)

    return () => window.clearTimeout(timeout)
  }, [containerStatus, startContainerModal])

  const containerImg: Partial<Record<ContainerStatus, string>> = {
    creating: creatingImg,
    "connecting-ws": connectingImg,
    active: activeImg,
  }

  const containerTitle: Partial<Record<ContainerStatus, string>> = {
    creating: t("agent.creating-container"),
    "connecting-ws": t("agent.connecting-ws"),
    active: t("agent.container-active"),
  }

  const connectingSubtitles = [
    t("agent.connecting-ws-step-1"),
    t("agent.connecting-ws-step-2"),
    t("agent.connecting-ws-step-3"),
    t("agent.connecting-ws-step-4"),
    t("agent.connecting-ws-step-5"),
  ]

  const containerSubtitle: Partial<Record<ContainerStatus, string>> = {
    creating: t("agent.creating-container-sub"),
    "connecting-ws": connectingSubtitles[connectingTextIndex],
    active: t("agent.container-active-sub"),
  }

  useEffect(() => {
    if (containerStatus !== "connecting-ws") {
      setConnectingTextIndex(0)
      return
    }

    const interval = window.setInterval(() => {
      setConnectingTextIndex((currentIndex) => {
        const nextIndex = currentIndex + 1

        if (nextIndex >= connectingSubtitles.length) {
          return 0
        }

        return nextIndex
      })
    }, 5000)

    return () => window.clearInterval(interval)
  }, [containerStatus, connectingSubtitles.length])

  const containerStep: Partial<Record<ContainerStatus, number>> = {
    creating: 1,
    "connecting-ws": 2,
    active: 3,
  }

  const currentStep = containerStep[containerStatus] ?? 0
  const steps = Array.from({ length: 3 })

  function handleRequestClose(value: boolean) {
    // Bloqueio se estiver processando ou se ainda estiver no estado inicial
    if (isProcessing || !isContainerStarted) return
    setStartContainerModal(value)
  }

  function handleOpenAbortConfirmation() {
    setConfirmAbortModal(true)
  }

  function handleCancelAbort() {
    setConfirmAbortModal(false)
  }

  function handleConfirmAbort() {
    if (abortStartContainerRef.current) {
      abortStartContainerRef.current.abort()
    }

    stopContainerHealthSocket()
    resetContainer()
    setConfirmAbortModal(false)
  }

  return (
    <>
      <Dialog open={startContainerModal} onOpenChange={handleRequestClose}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md lg:min-w-130"
          overlayClassName="bg-black/60 backdrop-blur-md"
        >
          {isProcessing && (
            <div className="relative">
              <button
                className="flex items-center justify-center size-6 rounded-full absolute top-6 right-6 bg-black/20 dark:bg-white/20 cursor-pointer"
                onClick={handleOpenAbortConfirmation}
              >
                <XIcon className="size-5 text-white" />
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {shouldShowStatus && (
              <motion.div
                key={containerStatus}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col items-center justify-center gap-4 text-center p-14"
              >
                <motion.img
                  initial={{ opacity: 0, y: 6 }}
                  animate={
                    isProcessing
                      ? { scale: [1, 1.04, 1], opacity: [1, 0.85, 1] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={
                    isProcessing
                      ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.25 }
                  }
                  className="w-60 h-60 mb-6 select-none"
                  draggable={false}
                  src={containerImg[containerStatus]}
                  alt={containerTitle[containerStatus]}
                />
                <motion.h1
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className="text-2xl text-black dark:text-white font-semibold"
                >
                  {containerTitle[containerStatus]}
                </motion.h1>
                <motion.p
                  key={containerSubtitle[containerStatus]}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className="max-w-75 text-base text-neutral-400 dark:text-neutral-300"
                >
                  {containerSubtitle[containerStatus]}
                </motion.p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {steps.map((_, index) => {
                    const step = index + 1
                    const isActive = step <= currentStep

                    return (
                      <motion.span
                        key={step}
                        initial={false}
                        animate={{
                          scale: isActive ? 1 : 0.92,
                          opacity: isActive ? 1 : 0.45,
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                          isActive ? "bg-brand-primary-200" : "bg-neutral-300"
                        }`}
                      />
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAbortModal} onOpenChange={setConfirmAbortModal}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md p-0"
          overlayClassName="bg-black/70 backdrop-blur-md"
        >
          <div className="flex flex-col gap-6 p-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                {t("agent.abort-start-container-title", "Abort initialization?")}
              </h2>

              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">
                {t(
                  "agent.abort-start-container-description",
                  "The container is still being prepared. If you abort now, the process will be interrupted and you may need to start it again.",
                )}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={handleCancelAbort}>
                {t("common.cancel", "Cancel")}
              </Button>

              <Button variant="destructive" onClick={handleConfirmAbort}>
                {t("agent.abort-start-container-confirm", "Abort process")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
