import { cn } from "@/lib/utils";

export default function SiteLayout({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto max-w-screen-xl px-4 md:px-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}
