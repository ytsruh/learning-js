import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  console.log(event.cookies.get("auth"));
  if (event.cookies.get("auth") !== "true" && !event.url.pathname.startsWith("/login")) {
    throw redirect(307, "/login");
  }

  // if (event.url.pathname.startsWith("/")) {
  //   //console.log(event);
  //   console.log(event.cookies.get("auth"));
  // }

  const response = await resolve(event);
  return response;
};
