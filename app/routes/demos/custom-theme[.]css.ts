import type { LoaderFunction } from "remix";

import type { Theme } from "~/themes";
import { getSession } from "~/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  let theme: Theme = session.get("theme");

  let css = "";

  if (theme) {
    let properties = Object.entries(theme).map(
      ([property, color]) => `--color-${property}: ${color};`
    );

    css = `:root {${properties.join(" ")}}`;
  }

  return new Response(css, {
    headers: {
      "Content-Type": "text/css",
    },
  });
};
