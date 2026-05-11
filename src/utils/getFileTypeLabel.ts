export function getFileTypeLabel(file?: File) {
  if (file?.type === "application/pdf") return "PDF"
  if (file?.type.includes("word")) return "DOC"
  if (file?.type === "text/plain") return "TXT"
  if (file?.type.startsWith("image/")) return "IMG"
  return "FILE"
}
