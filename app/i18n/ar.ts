import { arChrome } from "./ar-chrome";
import { arLegal } from "./ar-legal";
import { arHome } from "./ar-home";
import { arServices } from "./ar-services";
import { arPages } from "./ar-pages";
import { arAccount } from "./ar-account";
import { arOps } from "./ar-ops";

/**
 * Split by the part of the site the strings belong to, purely so each file
 * stays readable. Later spreads win, which never matters because the keys do
 * not overlap — `npm test` fails if two files claim the same English string
 * with different Arabic.
 */
export const dictionary: Record<string, string> = {
  ...arChrome,
  ...arHome,
  ...arServices,
  ...arPages,
  ...arLegal,
  ...arAccount,
  ...arOps,
};
