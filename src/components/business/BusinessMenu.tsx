import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { Building, Check, ChevronDown } from "lucide-react"
import { businessServices } from "@/services"
import { useMeStore } from "@/stores/meStore"
import { toast } from "@/hooks/useToast"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

export function BusinessMenu() {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const { me, setMe } = useMeStore()
  const {
    menuOpen,
    forceSelectBusinessOpen,
    setForceSelectBusinessOpen,
    setSelectedBusiness,
    setMenuOpen,
  } = useBusinessStore()

  const allBusinesses = me?.businesses ?? []
  const hasMultipleBusinesses = allBusinesses.length > 1

  const { data: currentBusiness, isLoading } = useQuery({
    queryKey: ["current-business"],
    queryFn: () => businessServices.getCurrentBusiness(),
    retry: false,
    enabled: !!me?.businesses?.length,
  })

  useEffect(() => {
    if (!me) return

    if (!currentBusiness) return setForceSelectBusinessOpen(true)

    setSelectedBusiness(currentBusiness)
    setForceSelectBusinessOpen(false)
  }, [currentBusiness, me])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (businessId: number) => businessServices.useBusiness(businessId),
    onSuccess: (data) => {
      setMe({ ...me, current_business_id: data.id })
      setSelectedBusiness(data)

      qc.invalidateQueries({ queryKey: ["business-secrets", data.id] })
      qc.invalidateQueries({ queryKey: ["current-business"] })
      qc.invalidateQueries({ queryKey: ["user-secrets", data.id] })
      qc.invalidateQueries({ queryKey: ["business"] })
      qc.invalidateQueries({ queryKey: ["prompts"] })
      qc.invalidateQueries({ queryKey: ["me"] })
      qc.invalidateQueries({ queryKey: ["sessions"] })
      qc.invalidateQueries({ queryKey: ["sort-sessions"] })
      qc.invalidateQueries({ queryKey: ["users", data.id] })

      toast({
        title: t("common.success"),
        description: t("business.business-changed-success"),
        type: "success",
      })
      setForceSelectBusinessOpen(false)
    },
  })

  const handleChangeBusiness = async (id: number) => {
    if (currentBusiness?.id === id) return
    await mutateAsync(id)
  }

  const handleChangeBusinessInModal = async (id: number) => {
    await mutateAsync(id)
  }

  const currentBusinessName = currentBusiness?.name ?? t("business.select-business")

  if (isLoading) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Building size={16} />
        {t("common.loading")}
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu onOpenChange={setMenuOpen} modal={hasMultipleBusinesses}>
        <DropdownMenuTrigger asChild disabled={!hasMultipleBusinesses}>
          <Button size="sm" variant="outline" isLoading={isPending}>
            <Building size={16} />
            {currentBusinessName}
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform",
                menuOpen ? "rotate-180" : "",
                !hasMultipleBusinesses && "hidden",
              )}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 bg-foreground text-[#111827] dark:text-white border dark:border-[#2d2d38]"
        >
          <DropdownMenuLabel>{t("business.business")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allBusinesses &&
            allBusinesses.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleChangeBusiness(item.id)}
                className="flex items-center justify-between"
              >
                {item.name}
                {item.id === currentBusiness?.id && <Check size={18} />}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={forceSelectBusinessOpen}>
        <DialogContent
          className="sm:max-w-100 [&>button]:hidden"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{t("business.select-business")}</DialogTitle>
            <DialogDescription>{t("business.need-select-business")}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 px-4 pb-6">
            {allBusinesses &&
              allBusinesses.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleChangeBusinessInModal(item.id)}
                >
                  {item.name}
                  {item.id === currentBusiness?.id && <Check size={18} />}
                </Button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
