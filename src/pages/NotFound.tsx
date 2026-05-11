import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import notFoundImg from "@/assets/images/404-not-found.svg"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotFound() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("404 Error: User attempted to access non-existent route:", location.pathname)
  }, [location.pathname])

  function handleReloadPage() {
    navigate("/dashboard", { replace: true })
  }

  return (
    <div className="flex justify-center h-dvh items-center p-8 lg">
      <div
        className={cn(
          "lg:max-w-9xl flex flex-col-reverse lg:flex-row items-start lg:items-center justify-center gap-10 p-10",
          "dark:bg-[#262F45] bg-[#F5F5F5] rounded-3xl",
        )}
      >
        <div className="lg:max-w-2xl flex flex-col items-start justify-between gap-4 self-stretch">
          <div className="space-y-4">
            <h1 className="text-black dark:text-white text-4xl font-semibold">
              {t("notfound.title")}
            </h1>
            <p className="text-xl text-gray-400">{t("notfound.description")}</p>
          </div>

          <Button className="w-fit" onClick={handleReloadPage}>
            <ArrowLeft className="size-4" />
            {t("notfound.btn-cta")}
          </Button>
        </div>
        <img src={notFoundImg} alt="Not Found" className="w-45 lg:w-52.5 max-w-full lg:ml-40" />
      </div>
    </div>
  )
}
