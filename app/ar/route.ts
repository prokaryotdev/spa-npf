import { languageRedirect } from "../i18n/redirect";

export const GET = (request: Request) => languageRedirect(request, "ar");
