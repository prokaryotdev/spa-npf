import { yoChrome } from "./yo-chrome";
import { yoHome } from "./yo-home";
import { yoServices } from "./yo-services";
import { yoPages } from "./yo-pages";
import { yoLegal } from "./yo-legal";
import { yoAccount } from "./yo-account";
import { yoOps } from "./yo-ops";

/** Yoruba, split the same way as the Hausa dictionary (see ha.ts). */
export const dictionary: Record<string, string> = {
  ...yoChrome,
  ...yoHome,
  ...yoServices,
  ...yoPages,
  ...yoLegal,
  ...yoAccount,
  ...yoOps,
};
