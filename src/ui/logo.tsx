import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  textHiddenOnSmall?: boolean;
}

const sizeMap = {
  xs: {
    logo: "w-6 h-6",
    bigText: "text-base",
    text: "text-xs",
    smallText: "text-xs",
  },
  sm: {
    logo: "w-8 h-8",
    bigText: "text-lg",
    text: "text-sm",
    smallText: "text-xs",
  },
  md: {
    logo: "w-10 h-10",
    bigText: "text-xl",
    text: "text-base",
    smallText: "text-sm",
  },
  lg: {
    logo: "w-12 h-12",
    bigText: "text-2xl",
    text: "text-lg",
    smallText: "text-base",
  },
  xl: {
    logo: "w-16 h-16",
    bigText: "text-3xl",
    text: "text-xl",
    smallText: "text-lg",
  },
};

export default function Logo({
  className,
  size = "md",
  textHiddenOnSmall,
}: LogoProps) {
  return (
    <Link href="/" className="relative flex items-center gap-2">
      <img
        src="/logo.png"
        alt="Ulmiversität Logo"
        className={cn("dark:invert", sizeMap[size].logo, className)}
      />
      <p
        className={cn(
          "font-semibold",
          sizeMap[size].text,
          textHiddenOnSmall && "hidden md:inline-block",
        )}
      >
        <span
          className={cn("text-primary font-extrabold", sizeMap[size].bigText)}
        >
          Ulm
        </span>
        iversität
      </p>
      <span
        className={cn(
          "bg-success text-success-foreground absolute -top-1.5 left-4 rotate-30 rounded-xs px-1 font-semibold",
          sizeMap[size].text,
        )}
      >
        Mensa
      </span>
    </Link>
  );
}
