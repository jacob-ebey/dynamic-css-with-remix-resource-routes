export type Theme = {
  foreground: string;
  background: string;
  links: string;
  ["links-hover"]: string;
  border: string;
};

export let darkTheme: Theme = {
  background: "#000000",
  border: "#404040",
  foreground: "#ffffff",
  links: "#75b3ff",
  "links-hover": "#99c7ff",
};

export let defaultTheme: Theme = {
  background: "#ffffff",
  border: "#d1d1d1",
  foreground: "#121212",
  links: "#0a78ff",
  "links-hover": "#0063db",
};
