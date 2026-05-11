import { useTranslation } from "react-i18next"
import bannerImg from "@/assets/images/hero-banner.webp"

export const HeroBanner = () => {
  const { t } = useTranslation()
  return (
    <section
      className="relative h-96 md:h-91.75 sm:h-80 xs:h-72 overflow-hidden rounded-3xl"
      aria-label="Banner principal - Newsletter de AI"
    >
      <img
        src={bannerImg}
        alt="Imagem de fundo com elementos visuais de inteligência artificial e design"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
      />
      <div className="relative flex flex-col justify-between items-center h-full p-4 md:p-8 bg-linear-to-r from-black/50 to-transparent">
        <div className="flex flex-col gap-4 md:gap-6 w-full">
          <div className="flex justify-between items-start">
            <h2 className="flex-1 text-white text-2xl md:text-4xl leading-8 lg:leading-10">
              {t("dashboard.bannerTitle")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 text-xs font-normal border border-white text-white rounded-full">
              {t("dashboard.tagAi")}
            </span>
            <span className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 text-xs font-normal border border-white text-white rounded-full">
              {t("dashboard.tagDesign")}
            </span>
            <span className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 text-xs font-normal border border-white text-white rounded-full">
              {t("dashboard.tagTecnologia")}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-white text-lg md:text-xl font-semibold">
              {t("dashboard.bannerSubtitle")}
            </h3>
            <p className="text-white text-sm md:text-base font-normal max-w-lg">
              {t("dashboard.bannerDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
