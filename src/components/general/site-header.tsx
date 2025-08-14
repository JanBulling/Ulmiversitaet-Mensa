import Logo from "@/ui/logo";
import { ModeSwitcher } from "./mode-switcher";

export function SiteHeader() {
  return (
    <>
      <header
        id="header"
        className="bg-card sticky top-0 z-50 w-full border-b shadow transition-all duration-300 ease-in-out"
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-2 px-4 md:px-12">
          <Logo size="md" />

          <div className="ml-auto flex items-center justify-end gap-2">
            <ModeSwitcher />
          </div>
        </div>
      </header>
      <script
        dangerouslySetInnerHTML={{
          __html: `function onScroll() {const header = document.getElementById("header");if (window.scrollY > 0) {header.classList.add("scrolled");} else {header.classList.remove("scrolled");}}document.addEventListener("scroll", onScroll);`,
        }}
      />
    </>
  );
}
