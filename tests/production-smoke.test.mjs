import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import test from "node:test";

test("the production site serves archive metadata, artwork and security headers", { timeout: 30_000 }, async () => {
  const port = process.env.SILO_SMOKE_PORT || "41373";
  const origin = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", port], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  server.stdout.on("data", (data) => { output += data.toString(); });
  server.stderr.on("data", (data) => { output += data.toString(); });

  try {
    let response;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (server.exitCode !== null) throw new Error(`Server exited before it was ready: ${output}`);
      try {
        response = await fetch(origin, { signal: AbortSignal.timeout(700) });
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }
    assert.ok(response, `Production server did not start: ${output}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /SILO — The Last City/);
    assert.match(html, /property="og:image"[^>]+opengraph-image/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.ok(html.includes('rel="canonical" href="https://silo-the-last-city.vercel.app"'), "Canonical URL missing");

    const csp = response.headers.get("content-security-policy") || "";
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /base-uri 'self'/);
    assert.match(csp, /script-src 'self'/);
    assert.doesNotMatch(csp, /unsafe-eval/);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("strict-transport-security"), "max-age=63072000");

    const image = await fetch(`${origin}/opengraph-image`);
    assert.equal(image.status, 200);
    assert.match(image.headers.get("content-type") || "", /^image\/png/);
    const bytes = Buffer.from(await image.arrayBuffer());
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1200);
    assert.equal(bytes.readUInt32BE(20), 630);

    const sitemap = await fetch(`${origin}/sitemap.xml`);
    assert.equal(sitemap.status, 200);
    assert.match(await sitemap.text(), /silo-the-last-city\.vercel\.app/);
  } finally {
    if (server.exitCode === null) {
      const stopped = once(server, "exit");
      server.kill();
      await stopped;
    }
  }
});
