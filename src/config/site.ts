export const BASE_URL = "https://mensa.ulmiversitaet.de";

export const siteConfig = {
  name: "Mensa Ulm",
  url: BASE_URL,
  ogImage: `${BASE_URL}/og`,
  description: "Mensaplan der Universität Ulm",
  links: {
    github: "https://github.com/janbulling/ulmiversitaet-mensa",
    instagram: "https://www.instagram.com/ulmiversitaet/",
  },
};

export type SiteConfig = typeof siteConfig;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const navItems = [
  { href: "/", label: "Alle Gerichte" },
  { href: "/best-meals", label: "Beste Gerichte" },
  { href: "/worst-meals", label: "Schlechteste Gerichte" },
];
