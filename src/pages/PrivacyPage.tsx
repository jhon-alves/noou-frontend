import { useTranslation } from "react-i18next"
import { PageWrapper } from "@/components/shared/PageWrapper"

interface ContentProps {
  title?: string
  text?: string
  sections?: {
    subtitle?: string
    text?: string
    list?: string[]
    contact?: string
  }[]
}

const PrivacyPage = () => {
  const { t } = useTranslation()

  const content = t("privacy.content", { returnObjects: true }) as ContentProps[]

  return (
    <PageWrapper>
      <div className="mb-3">
        <h1 className="text-4xl font-bold text-[#111827] dark:text-white mb-4">
          {t("privacy.title")}
        </h1>
        <p className="text-sm text-[#666f8d] dark:text-[#9ca3af]">{t("privacy.lastUpdated")}</p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {content.map((section, idx) => (
          <div key={idx} className="space-y-4">
            {/* Section Title */}
            {section.title && (
              <h2 className="text-xl md:text-2xl font-bold text-[#111827] dark:text-white">
                {section.title}
              </h2>
            )}

            {/* Section Text */}
            {section.text && (
              <p className="text-[15px] leading-relaxed text-[#666f8d] dark:text-[#9ca3af]">
                {section.text}
              </p>
            )}

            {/* Subsections */}
            {section.sections && (
              <div className="space-y-6 pl-0 md:pl-4">
                {section.sections.map((subsection, subIdx) => (
                  <div key={subIdx} className="space-y-3">
                    {/* Subsection Title */}
                    {subsection.subtitle && (
                      <h3 className="font-semibold text-[#111827] dark:text-white">
                        {subsection.subtitle}
                      </h3>
                    )}

                    {/* Subsection Text */}
                    {subsection.text && (
                      <p className="text-[15px] leading-relaxed text-[#666f8d] dark:text-[#9ca3af]">
                        {subsection.text}
                      </p>
                    )}

                    {/* List */}
                    {subsection.list && (
                      <ul className="space-y-2 pl-4">
                        {subsection.list.map((item, listIdx) => (
                          <li
                            key={listIdx}
                            className="text-[15px] leading-relaxed text-[#666f8d] dark:text-[#9ca3af] list-disc"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Contact Email */}
                    {subsection.contact && (
                      <div className="mt-4">
                        <a
                          href={`mailto:${subsection.contact}`}
                          className="inline-flex items-center gap-2 text-[#111827] dark:text-white font-medium hover:opacity-70 transition-opacity"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {subsection.contact}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-[#e3e6ea] dark:border-[#2d2d38]">
        <p className="text-sm text-[#666f8d] dark:text-[#9ca3af] text-center">
          © 2025 Noou. {t("privacy.copyright")}
        </p>
      </div>
    </PageWrapper>
  )
}

export default PrivacyPage
