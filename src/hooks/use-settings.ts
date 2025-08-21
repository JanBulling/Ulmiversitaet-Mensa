import { useStorage } from "./use-storage";

export type Preference =
  | "VEGAN"
  | "VEGETARIAN"
  | "PESCETARIAN"
  | "NO-PORK"
  | "NONE";

export type Settings = {
  priceType: "STUDENT" | "EMPLOYEE" | "OTHER";
  hideBadMeals: boolean;
  preferences: Preference;
};

export const defaultSettings: Settings = {
  priceType: "STUDENT",
  hideBadMeals: false,
  preferences: "NONE",
};

export function useSettings() {
  const [priceType, setPriceType] = useStorage(
    "price-type",
    defaultSettings.priceType,
  );
  const [hideBadMeals, setHideBadMeals] = useStorage(
    "hide-bad-meals",
    defaultSettings.hideBadMeals,
  );
  const [preferences, setPreferences] = useStorage(
    "meal-type-preferences",
    defaultSettings.preferences,
  );

  return {
    priceType,
    setPriceType,
    hideBadMeals,
    setHideBadMeals,
    preferences,
    setPreferences,
  };
}
