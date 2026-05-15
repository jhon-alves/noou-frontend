import { motion } from "motion/react"
import { useTranslation } from "react-i18next"

export function LoadingMessage() {
  const { t } = useTranslation()

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.img
        src="/favicon.png"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-14 h-14 object-cover"
      />

      <motion.p
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="text-sm text-muted-foreground"
      >
        {t("common.loading")}
      </motion.p>
    </motion.div>
  )
}
