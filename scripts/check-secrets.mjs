import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

// Intentionally report paths only: CI logs must never repeat a credential.
const patterns = [
  /sk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{40,}/,
  /AIza[A-Za-z0-9_-]{30,}/,
  /AKIA[A-Z0-9]{16}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?key|secret|access[_-]?token|password)\s*[:=]\s*["'][A-Za-z0-9_\-/+=.]{16,}["']/i,
];
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" }).split("\0").filter((path) => path && existsSync(path));
const findings = [];
for (const path of files) {
  const text = readFileSync(path, "utf8");
  if (patterns.some((pattern) => pattern.test(text))) findings.push(path);
}
if (findings.length) {
  console.error(`Potential credentials detected in: ${findings.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`No common credential patterns found in ${files.length} tracked files.`);
}
