import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-secondary group-[.toaster]:text-white group-[.toaster]:border-secondary/50 group-[.toaster]:shadow-lg group-[.toaster]:text-base group-[.toaster]:py-4 group-[.toaster]:px-5",
          description: "group-[.toast]:text-white/80 group-[.toast]:text-sm",
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-secondary",
          cancelButton: "group-[.toast]:bg-white/20 group-[.toast]:text-white",
          error: "group-[.toaster]:bg-secondary group-[.toaster]:text-white group-[.toaster]:border-secondary/50",
          success: "group-[.toaster]:bg-secondary group-[.toaster]:text-white group-[.toaster]:border-secondary/50",
          warning: "group-[.toaster]:bg-secondary group-[.toaster]:text-white group-[.toaster]:border-secondary/50",
          info: "group-[.toaster]:bg-secondary group-[.toaster]:text-white group-[.toaster]:border-secondary/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
