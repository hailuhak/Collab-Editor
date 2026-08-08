/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Custom Next.js server that also hosts the Socket.IO realtime layer.
 *
 * Run in development:  node server.js dev
 * Run in production:   npm run build && node server.js
 *
 * We use a custom server so that the Socket.IO instance and the Next.js app
 * share a single HTTP port. This file is intentionally plain CommonJS because
 * it does not go through the Next.js compiler.
 */

const { createServer } = require("http");
const { loadEnvConfig } = require("@next/env");
const next = require("next");
const { initSocketServer } = require("./server/socket-server");

// Load .env / .env.local before anything else so the socket layer and Prisma
// see the same configuration as the Next.js app.
loadEnvConfig(process.cwd());

const dev = process.argv.includes("dev");
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = "0.0.0.0";

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => handle(req, res));

    initSocketServer(server);

    server.listen(port, hostname, (err) => {
      if (err) throw err;
      console.log(
        `> CollabDocs ready on http://localhost:${port} ${dev ? "(dev)" : "(production)"}`
      );
      console.log(`> Socket.IO mounted at http://localhost:${port}/socket.io`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
