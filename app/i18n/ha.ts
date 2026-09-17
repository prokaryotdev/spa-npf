import { haChrome } from "./ha-chrome";
import { haLegal } from "./ha-legal";
import { haHome } from "./ha-home";
import { haServices } from "./ha-services";
import { haPages } from "./ha-pages";
import { haAccount } from "./ha-account";
import { haOps } from "./ha-ops";

/**
 * Split by the part of the site the strings belong to, purely so each file
 * stays readable. Later spreads win, which never matters because the keys do
 * not overlap — `npm test` fails if two files claim the same English string
 * with different Hausa.
 */
export const dictionary: Record<string, string> = {
  ...haChrome,
  ...haHome,
  ...haServices,
  ...haPages,
  ...haLegal,
  ...haAccount,
  ...haOps,
};
