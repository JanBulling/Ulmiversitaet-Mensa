import { Button } from "@/ui/button";
import Logo from "@/ui/logo";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-2 px-4 pt-4 pb-1 md:flex-row md:px-12">
        <Logo size="sm" />
        <div className="text-muted-foreground text-sm">
          Ein Service der{" "}
          <Link className="hover:underline" href="https://ulmiversitaet.de">
            Ulmiversität
          </Link>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()}</p>
          <Button variant="ghost" className="p-1 text-xs">
            <Link
              href="https://jan-bulling.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jan Bulling
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
