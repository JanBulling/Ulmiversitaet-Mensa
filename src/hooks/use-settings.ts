import { useStorage } from "./use-storage";

export type Settings = {
  priceType: "STUDENT" | "EMPLOYEE" | "OTHER";
  hideBadMeals: boolean;
};

export const defaultSettings: Settings = {
  priceType: "STUDENT",
  hideBadMeals: false,
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

  return { priceType, setPriceType, hideBadMeals, setHideBadMeals };
}
