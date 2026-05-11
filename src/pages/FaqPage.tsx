import { Chip } from "@/components/shared/Chip"
import { PageHeader } from "@/components/shared/PageHeader"
import { PageWrapper } from "@/components/shared/PageWrapper"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const FaqPage = () => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = t("faq.categories", { returnObjects: true }) as Record<string, string>

  const categoriesFiltered = Object.entries(categories).map(([id, label]) => ({
    id,
    label,
  }))

  const questions = t("faq.questions", { returnObjects: true }) as {
    question: string
    answer: string
    category: string
  }[]

  const filteredQuestions =
    selectedCategory === "all"
      ? questions
      : questions.filter((q) => q.category === selectedCategory)

  return (
    <PageWrapper>
      <PageHeader
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
        breadcrumbs={[{ label: t("nav.home"), href: "/dashboard" }, { label: t("faq.title") }]}
      />

      <section>
        <h2 className="text-xl font-semibold text-[#111827] dark:text-white mb-4">
          {t("faq.frequently-asked-questions")}
        </h2>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {categoriesFiltered.map((category) => (
            <Chip
              key={category.id}
              variant="filter"
              label={category.label}
              selected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {filteredQuestions.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-3xl px-6">
              <AccordionTrigger className="text-left text-black dark:text-white py-6">
                <span className="font-medium  leading-relaxed pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-[#666f8d] dark:text-[#9ca3af] leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageWrapper>
  )
}

export default FaqPage
