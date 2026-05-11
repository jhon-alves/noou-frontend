import { useTranslation } from "react-i18next"
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { useState } from "react"

type ContentsTableMenuProps = {
  onView: () => void
  onEdit: (edit: boolean) => void
  onDelete: () => Promise<void> | void
}

export function ContentsTableMenu({ onView, onEdit, onDelete }: ContentsTableMenuProps) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleOpenEditContent() {
    onEdit(true)
  }

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
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" /> {t("common.view")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenEditContent}>
            <Pencil className="mr-2 h-4 w-4" /> {t("common.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onSelect={() => {
              setMenuOpen(false)
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> {t("common.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirm dialog para deletar */}
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
    </>
  )
}
