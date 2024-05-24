import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const input = data.get("password");
    if (input === "theytookourjobs") {
      event.cookies.set("auth", "true");
      throw redirect(303, "/");
    }
    return fail(400, { success: false });
  },
} satisfies Actions;
