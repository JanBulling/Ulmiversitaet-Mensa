"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { useMetaColor } from "@/hooks/use-meta-color";
import { useSettings } from "@/hooks/use-settings";
import { META_THEME_COLORS } from "@/config/site";
import { Button } from "@/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";
import { Switch } from "@/ui/input/switch";
import { Label } from "@/ui/input/label";

export function Settings() {
  const { priceType, setPriceType, hideBadMeals, setHideBadMeals } =
    useSettings();

  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor } = useMetaColor();
  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark,
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  return (
    <div className="mt-4 space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Theme</h3>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={toggleTheme}
        >
          In{" "}
          <span className="font-bold">
            {resolvedTheme === "dark" ? "Light-Mode" : "Dark-Mode"}
          </span>{" "}
          wechseln
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Ich bin...</h3>
        <Select value={priceType} onValueChange={setPriceType}>
          <SelectTrigger className="mt-2">
            <SelectValue defaultValue={priceType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="EMPLOYEE">Mitarbeiter</SelectItem>
            <SelectItem value="OTHER">Gast / Sonstiges</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground mt-1 text-sm">
          Diese Einstellung wird benötigt, um die korrekten Mensa-Preise
          anzuzeigen
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Schlechte Gerichte anzeigen?</h3>
        <div className="flex items-center gap-2">
          <Switch
            id="hide-bad-meals"
            checked={hideBadMeals}
            onCheckedChange={setHideBadMeals}
          />
          <Label htmlFor="hide-bad-meals">Menüs verstecken</Label>
        </div>

        <p className="text-muted-foreground mt-1 text-sm">
          Gerichte, die mit unter 2.5/5{" "}
          <span className="font-bold">Schmackofunken</span> bewertet wurden,
          werden ausgeblendet
        </p>
      </div>
    </div>
  );
}
