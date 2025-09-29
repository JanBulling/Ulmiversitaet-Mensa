import Logo from "@/ui/logo";
import { ModeSwitcher } from "./mode-switcher";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/ui/button";
import { MainNav } from "./main-nav";
import MobileNav from "./mobile-nav";
import { navItems } from "@/config/site";
import { Suspense } from "react";

export function SiteHeader() {
  return (
    <>
      <header className="bg-card w-full border-b shadow">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-2 px-4 md:px-12">
          <Suspense>
            <Logo size="md" />
          </Suspense>

          <MainNav
            items={navItems}
            className="hidden md:flex md:flex-1 md:justify-center"
          />

          <div className="flex items-center justify-end gap-2">
            <ModeSwitcher />

            <MobileNav items={navItems} />

            <Link href="/settings" className="hidden md:block">
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
