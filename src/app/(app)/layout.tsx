import { SiteFooter } from "@/components/general/site-footer";
import { SiteHeader } from "@/components/general/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col px-4 md:px-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
