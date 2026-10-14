import { igChrome } from "./ig-chrome";
import { igHome } from "./ig-home";
import { igServices } from "./ig-services";
import { igPages } from "./ig-pages";
import { igLegal } from "./ig-legal";
import { igAccount } from "./ig-account";
import { igOps } from "./ig-ops";
import { igRecords } from "./ig-records";

/** Igbo, split the same way as the Hausa dictionary (see ha.ts). */
export const dictionary: Record<string, string> = {
  ...igChrome,
  ...igHome,
  ...igServices,
  ...igPages,
  ...igLegal,
  ...igAccount,
  ...igOps,
  ...igRecords,
};
