import { useState } from "react"
import { useTranslation } from "react-i18next"
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
} from "@/components/ui/alert-dialog"
import { Edit, MoreVertical, Shield, Trash2 } from "lucide-react"

type BusinessUsersTableMenuProps = {
  isCurrentUser: boolean
  onPermissions: () => void
  onEdit: () => void
  onDelete: () => Promise<void> | void
}

export function BusinessUsersTableMenu({
  isCurrentUser,
  onPermissions,
  onEdit,
  onDelete,
}: BusinessUsersTableMenuProps) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
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
          <DropdownMenuItem onClick={onPermissions}>
            <Shield className="mr-2 h-4 w-4" /> {t("common.permissions")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" /> {t("common.edit")}
          </DropdownMenuItem>
          {!isCurrentUser && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-400"
                onSelect={() => {
                  setMenuOpen(false)
                  setDeleteOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> {t("common.delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
              className="bg-red-400 hover:bg-red-500/90"
              onClick={async () => {
                await onDelete()
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
