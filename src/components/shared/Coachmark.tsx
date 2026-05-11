import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { useEffect, useRef, useState } from "react"

interface CoachmarkProps extends React.PropsWithChildren {
  open: boolean
  onClose: () => void
}

export function Coachmark({ open, onClose, children }: CoachmarkProps) {
  const { t } = useTranslation()
  const targetRef = useRef<HTMLDivElement>(null)
  const coachmarkRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    if (!open || !targetRef.current) return

    const rect = targetRef.current.getBoundingClientRect()

    setPosition({
      top: rect.bottom + 12,
      left: rect.left,
      width: rect.width,
    })
  }, [open])

  // useEffect(() => {
  //   if (!open) return;

  //   function handleClickOutside(event: MouseEvent) {
  //     const target = event.target as Node;

  //     const clickedOutsideButton = targetRef.current && !targetRef.current.contains(target);

  //     const clickedOutsideCoachmark =
  //       coachmarkRef.current && !coachmarkRef.current.contains(target);

  //     if (clickedOutsideButton && clickedOutsideCoachmark) {
  //       onClose
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [open]);

  return (
    <>
      {/* Wrapper */}
      <div ref={targetRef} className="inline-block relative">
        {children}
      </div>

      {/* Coachmark */}
      {open &&
        createPortal(
          <div
            ref={coachmarkRef}
            className="fixed z-50"
            style={{ top: position.top, left: position.left }}
          >
            <div className="relative bg-gray-100 dark:bg-background border border-gray-300 dark:border-white/10 rounded-xl p-4 w-64">
              <div
                className="absolute -top-2 w-4 h-4 bg-gray-100 dark:bg-background rotate-45 border-l border-t border-gray-300 dark:border-white/10"
                style={{
                  left: position.width / 2 - 8, // centraliza no botão
                }}
              />
              <p className="text-sm text-black dark:text-white font-medium">
                {t("agent.title-use-prompt-modal")}
              </p>
              <div className="flex items-center justify-end mt-2">
                <button className="text-xs text-muted-foreground cursor-pointer" onClick={onClose}>
                  Fechar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
