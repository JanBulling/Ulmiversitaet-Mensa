import Logo from "@/ui/logo";
import { ModeSwitcher } from "./mode-switcher";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/ui/button";

export function SiteHeader() {
  return (
    <>
      <header className="bg-card w-full border-b shadow">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-2 px-4 md:px-12">
          <Logo size="md" />

          <div className="ml-auto flex items-center justify-end gap-2">
            <ModeSwitcher />
            <Link href="/settings">
              <Button variant="outline" size="icon" className="cursor-pointer">
                <Settings />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
