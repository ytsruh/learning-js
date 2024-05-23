import { Context } from "hono";
import { renderToString } from "react-dom/server";

export default function renderClient(c: Context) {
  return c.html(
    renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          {import.meta.env.PROD ? (
            <link rel="stylesheet" href="/static/assets/style.css" />
          ) : (
            <link rel="stylesheet" href="/src/style.css" />
          )}
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js"></script>
          ) : (
            <script type="module" src="/src/client.tsx"></script>
          )}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <div id="root" className="min-h-screen"></div>
        </body>
      </html>,
    ),
  );
}
