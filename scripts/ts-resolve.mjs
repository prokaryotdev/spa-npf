/**
 * Lets node run the app's .ts modules directly: TypeScript source imports
 * "./content", and node's ESM resolver wants "./content.ts". Node strips the
 * types itself, so this hook is the whole of the test setup.
 *
 *   node --import ./scripts/ts-resolve.mjs scripts/test-search.mjs
 */
import { register } from "node:module";

register("./ts-resolve-hook.mjs", import.meta.url);
