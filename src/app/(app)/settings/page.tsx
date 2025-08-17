import { Settings } from "@/components/general/settings";
import SiteLayout from "@/components/general/site-layout";

export default function SettingsPage() {
  return (
    <SiteLayout className="my-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground">
        Alle möglichen Einstellungen, um dein Mensa-Erlebnis zu verbessern!
      </p>

      <Settings />
    </SiteLayout>
  );
}
