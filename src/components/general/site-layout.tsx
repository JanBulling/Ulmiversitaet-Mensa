import { cn } from "@/lib/utils";

interface SiteLayoutProps extends React.ComponentProps<"div"> {}

export default function SiteLayout({
  children,
  className,
  ...props
}: SiteLayoutProps) {
  return (
    <div
      className={cn("mx-auto max-w-screen-xl px-4 md:px-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}
