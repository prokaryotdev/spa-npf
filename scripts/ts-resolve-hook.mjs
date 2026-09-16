import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Appends .ts to extensionless relative imports, when that file is there. */
export async function resolve(specifier, context, next) {
  const last = specifier.split("/").pop() ?? "";
  if (specifier.startsWith(".") && !last.includes(".")) {
    const url = new URL(specifier + ".ts", context.parentURL);
    if (existsSync(fileURLToPath(url))) return next(url.href, context);
  }
  return next(specifier, context);
}
