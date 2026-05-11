import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, KeyIcon, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useMeStore } from "@/stores/meStore"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { BusinessData } from "@/services/business/types"

type BusinessTableMenuProps = {
  business: BusinessData
  onView: () => void
  onSecret: () => void
  onDelete: () => Promise<void> | void
}

export function BusinessTableMenu({
  business,
  onView,
  onSecret,
  onDelete,
}: BusinessTableMenuProps) {
  const { t } = useTranslation()
  const { me } = useMeStore()
  const { setIsEditBusiness, setSelectedBusiness, setCreateBusinessModal } = useBusinessStore()

  function onEdit() {
    setSelectedBusiness(business)
    setCreateBusinessModal(true)
    setIsEditBusiness(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Mais ações"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 bg-background">
        <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" /> {t("common.view")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" /> {t("common.edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {business.id === me.current_business_id && (
          <>
            <DropdownMenuItem onClick={onSecret}>
              <KeyIcon className="mr-2 h-4 w-4" /> {t("common.secrets")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Confirm dialog para deletar */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
              <Trash2 className="mr-2 h-4 w-4" /> {t("common.delete")}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("business.confirm-delete")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("business.confirm-delete-description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-600/90"
                onClick={async () => {
                  await onDelete()
                }}
              >
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
