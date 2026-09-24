/**
 * Interface chrome: navigation, controls, form labels, empty and error
 * states — everything written into a component rather than into a content
 * file.
 *
 * Standard Hausa in the boko orthography, with the hooked letters (ɓ ɗ ƙ)
 * spelled properly. The site's own faces do not carry them, so the CSS font
 * stack falls through per character to a face that does; that is why the
 * fallback families in globals.css are not decorative.
 *
 * Institutional names stay as they are read on the ground: the Force is
 * "Rundunar 'Yan Sandan Najeriya", and FCT stays FCT.
 */
export const haChrome: Record<string, string> = {
  // --- header, footer, global ---------------------------------------------
  "Skip to main content": "Tsallake zuwa babban shafi",
  Home: "Gida",
  Main: "Babba",
  "Main menu": "Babban menu",
  "Main Menu": "Babban Menu",
  "Open menu": "Buɗe menu",
  "Close menu": "Rufe menu",
  Close: "Rufe",
  Breadcrumb: "Hanyar shafi",
  "Back to home": "Koma gida",
  "On this page": "A wannan shafi",
  Call: "Kira",
  "Rate this service": "Ba wannan aikin maki",
  "Larger text": "Rubutu mafi girma",
  Innovation: "Ƙirƙira",
  "Nigeria Police Force home": "Gidan Rundunar 'Yan Sandan Najeriya",
  "Nigeria Police Force AIX": "AIX na Rundunar 'Yan Sandan Najeriya",
  "Federal Republic of Nigeria": "Jamhuriyar Tarayyar Najeriya",
  "Emergency Numbers": "Lambobin Gaggawa",
  "Search Nigeria Police Force": "Nemi a Rundunar 'Yan Sandan Najeriya",
  "Nigeria Police Force, FCT Command - Safe Secure Together":
    "Rundunar 'Yan Sandan Najeriya, Rundunar FCT — Lafiya, Tsaro, Tare",
  "Together for a safer Abuja tomorrow. Report, apply, inquire and pay, and request support from the Nigeria Police Force in the Federal Capital Territory.":
    "Tare domin Abuja mai aminci gobe. Ka bayar da rahoto, ka nema, ka tambaya ka biya, kuma ka nemi taimako daga Rundunar 'Yan Sandan Najeriya a Babban Birnin Tarayya.",
  "© {year} FCT Police Command Headquarters. All Rights Reserved":
    "© {year} Hedkwatar Rundunar 'Yan Sandan FCT. An Kiyaye Duk Haƙƙoƙi",
  "This site is monitored and maintained by Nigeria Police Force.":
    "Rundunar 'Yan Sandan Najeriya ce ke sa ido tare da kula da wannan shafin.",
  "The site is best viewed in a current version of Chrome, Safari, Edge or Firefox":
    "Ana kallon shafin da kyau a sabon salon Chrome, Safari, Edge ko Firefox",
  "Last modified Date: {date}": "Kwanan sabuntawa na ƙarshe: {date}",

  // --- newsletter ---------------------------------------------------------
  "Subscribe to our Newsletter": "Yi rajista ga wasiƙarmu",
  Subscribe: "Yi rajista",
  "Stay updated with the latest news and announcements.":
    "Ka ci gaba da sanin sabbin labarai da sanarwa.",
  "Thanks, you are on the list.": "Na gode, kana cikin jerin.",
  "Email address": "Adireshin imel",

  // --- search, lists, filters --------------------------------------------
  "Search {what}": "Nemi {what}",
  "Search {noun}": "Nemi {noun}",
  "Filter by name": "Tace da suna",
  "Filter by category": "Tace da rukuni",
  "All categories": "Duk rukunan",
  "All types": "Duk nau'uka",
  Type: "Nau'i",
  "Sort by": "Tsara da",
  "Newest first": "Sabo na farko",
  "Oldest first": "Tsoho na farko",
  "{shown} of {total}": "{shown} daga {total}",
  "Showing {shown} of {total} {noun}":
    "Ana nuna {shown} daga {total} {noun}",
  "Page {page} of {pages}": "Shafi na {page} daga {pages}",
  "Next page": "Shafi na gaba",
  "Previous page": "Shafi na baya",

  // --- feedback form ------------------------------------------------------
  "What would you like to share?": "Me kake son ka bayar?",
  "Your name": "Sunanka",
  "Phone number (optional)": "Lambar waya (ba dole ba)",
  Send: "Aika",
  "Send another": "Aika wani",
  "Your {kind}": "{kind} naka",
  "Reference:": "Lambar tuntuɓa:",
  "Thank you — your {kind} has been recorded":
    "Na gode — an rubuta {kind} naka",
  "A member of the team will be in touch by email. Reference numbers are issued once the service is connected.":
    "Wani daga cikin tawagar zai tuntuɓe ka ta imel. Ana bayar da lambobin tuntuɓa da zarar an haɗa aikin.",
  "Service Rating (opens in a new window)":
    "Ƙimar Hidima (yana buɗewa a sabon taga)",

  // --- error and empty states --------------------------------------------
  "Page not found": "Ba a sami shafin ba",
  "Page not found | Nigeria Police Force":
    "Ba a sami shafin ba | Rundunar 'Yan Sandan Najeriya",
  "That page has moved or never existed. Here is the way back.":
    "Shafin ya ƙaura ko kuma bai taɓa kasancewa ba. Ga hanyar dawowa.",
  "Something went wrong": "Wani abu ya faskara",
  "Something went wrong | Nigeria Police Force":
    "Wani abu ya faskara | Rundunar 'Yan Sandan Najeriya",
  "This page failed to load. Trying again often clears it.":
    "Shafin bai buɗe ba. Sau da yawa sake gwadawa yakan warware shi.",
  "The site failed to load. Trying again often clears it.":
    "Shafin bai buɗe ba. Sau da yawa sake gwadawa yakan warware shi.",
  "Try again": "Sake gwadawa",
};
