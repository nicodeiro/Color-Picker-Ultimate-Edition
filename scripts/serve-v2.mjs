import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const port = Number.parseInt(process.env.COLOR_PICKER_QA_PORT || "4175", 10);
const allowed = new Map([
  ["/", ["popup-v2.html", "text/html; charset=utf-8"]],
  ["/popup-v2.html", ["popup-v2.html", "text/html; charset=utf-8"]],
  ["/popup-v2.css", ["popup-v2.css", "text/css; charset=utf-8"]],
  ["/popup-v2.js", ["popup-v2.js", "text/javascript; charset=utf-8"]],
  ["/vendor/lucide-icons.js", ["vendor/lucide-icons.js", "text/javascript; charset=utf-8"]]
]);

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
  const entry = allowed.get(requestUrl.pathname);
  if (!entry) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  try {
    const bytes = await readFile(path.join(root, entry[0]));
    response.writeHead(200, {
      "content-type": entry[1],
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    });
    response.end(bytes);
  } catch {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Unable to read fixture");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Synthetic Color Picker v2 fixture server");
  console.log("http://127.0.0.1:" + port + "/popup-v2.html?fixture=target");
});
