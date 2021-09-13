import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, redirect, useActionData, useLoaderData } from "remix";

import { commitSession, getSession } from "~/session.server";
import { darkTheme, defaultTheme } from "~/themes";
import type { Theme } from "~/themes";

export function meta() {
  return { title: "Theme Demo" };
}

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));

  let theme = session.get("theme");

  return theme || defaultTheme;
};

// When your form sends a POST, the action is called on the server.
// - https://remix.run/api/conventions#action
// - https://remix.run/guides/data-updates
export let action: ActionFunction = async ({ request }) => {
  let [session, formData] = await Promise.all([
    getSession(request.headers.get("Cookie")),
    request.formData(),
  ]);
  let action = formData.get("_action");

  let newTheme: Partial<Theme>;

  if (action === "reset") {
    newTheme = defaultTheme;
  } else if (action === "dark") {
    newTheme = darkTheme;
  } else {
    newTheme = {};
    for (let key of Object.keys(defaultTheme) as Array<keyof Theme>) {
      let color = formData.get(key);
      if (typeof color !== "string" || !color) {
        return json(`missing color ${key} in input`);
      }
      newTheme[key] = color;
    }
  }

  session.set("theme", newTheme);

  return redirect("/demos/theme", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function ThemesDemo() {
  // https://remix.run/api/remix#useloaderdata
  let theme = useLoaderData<Theme>();
  // https://remix.run/api/remix#useactiondata
  let actionMessage = useActionData<string>();

  return (
    <div className="remix__page">
      <main>
        <h2>Custom Themes!</h2>
        <p>
          This is an example of using session storage to generate a custom CSS
          file for your user based on their preferences.
        </p>
        {/* reloadDocument is used to force the browser to reload stylesheets */}
        <Form reloadDocument method="post" className="remix__form">
          <h3>Colors</h3>
          <p>
            <i>Choose the colors to theme the website to your liking.</i>
          </p>
          <p>Default themes</p>
          <div>
            <button name="_action" value="reset">
              Light
            </button>
            <button name="_action" value="dark">
              Dark
            </button>
          </div>
          <label>
            <div>Foreground color</div>
            <input
              name="foreground"
              type="color"
              defaultValue={theme.foreground}
              key={theme.foreground}
            />
          </label>
          <label>
            <div>Background color</div>
            <input
              name="background"
              type="color"
              defaultValue={theme.background}
              key={theme.background}
            />
          </label>
          <label>
            <div>Links color</div>
            <input name="links" type="color" defaultValue={theme.links} />
          </label>
          <label>
            <div>Links hover color</div>
            <input
              name="links-hover"
              type="color"
              defaultValue={theme["links-hover"]}
              key={theme["links-hover"]}
            />
          </label>
          <label>
            <div>Border color</div>
            <input
              name="border"
              type="color"
              defaultValue={theme.border}
              key={theme.border}
            />
          </label>
          <div>
            <button>Save</button>
          </div>
          {actionMessage ? (
            <p>
              <b>{actionMessage}</b>
            </p>
          ) : null}
        </Form>
      </main>

      <aside>
        <h3>Additional Resources</h3>
        <ul>
          <li>
            Guide:{" "}
            <a href="https://remix.run/guides/data-writes">Data Writes</a>
          </li>
          <li>
            API:{" "}
            <a href="https://remix.run/api/conventions#action">
              Route Action Export
            </a>
          </li>
          <li>
            API:{" "}
            <a href="https://remix.run/api/remix#useactiondata">
              useActionData
            </a>
          </li>
          <li>
            API:{" "}
            <a href="https://remix.run/api/remix#createcookiesessionstorage">
              createCookieSessionStorage
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}
