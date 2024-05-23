import { Hono } from "hono";
import api from "@/api";
import renderClient from "@/middleware/renderClient";

const app = new Hono();

app.route("/api", api);
app.get("*", renderClient);

export default app;
