import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useThemeStore } from "@/stores/useThemeStore"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useThemeStore();

  const toastIcons = {
    success: <CircleCheckIcon className="size-5 text-white" />,
    warning: <TriangleAlertIcon className="size-5 text-white" />,
    error: <OctagonXIcon className="size-5 text-white" />,
    info: <InfoIcon className="size-5 text-white" />,
  };

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={toastIcons}
      {...props}
    />
  );
};

export { Toaster };
