import { useTranslation } from "react-i18next"

export function AuthHero() {
  const { t } = useTranslation()

  return (
    <div className="hidden lg:flex flex-1 items-center justify-center dark:bg-neutral-800 bg-[#1a2332] relative overflow-hidden p-12">
      <div className="relative z-10 flex flex-col justify-between gap-12 text-primary-foreground">
        <div>
          <img src="/logo.webp" alt="Noou" className="h-11 w-auto object-contain mb-27" />
          <div className="max-w-129">
            <h1 className="text-[36px] lg:text-5xl xl:text-6xl mb-4 font-bold leading-tight text-white">
              {t("login.title")}
            </h1>
            <p className="text-lg lg:text-xl opacity-90 text-white dark:text-[#9ca3af]">
              {t("login.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-[#2a3442] text-white text-sm rounded-full border border-[#374151]">
            {t("login.tags.ia")}
          </span>
          <span className="px-4 py-2 bg-[#2a3442] text-white text-sm rounded-full border border-[#374151]">
            {t("login.tags.business")}
          </span>
          <span className="px-4 py-2 bg-[#2a3442] text-white text-sm rounded-full border border-[#374151]">
            {t("login.tags.design")}
          </span>
          <span className="px-4 py-2 bg-[#2a3442] text-white text-sm rounded-full border border-[#374151]">
            {t("login.tags.tecnologia")}
          </span>
        </div>
      </div>
    </div>
  )
}
