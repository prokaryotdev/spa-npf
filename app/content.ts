/**
 * Content for the Nigeria Police Force.
 * Card palettes are the per-card CSS custom properties each card ships.
 */

type CardTheme = {
  /** Deep brand ink for the card's chips and button text. */
  ink: string;
  /** Pale chip background. */
  tint: string;
  /** Chip border. */
  edge: string;
  /** Shadow colour, matched to the ink. */
  shadow: string;
};

export type InitiativeCard = {
  title: string;
  body: string;
  image: string;
  /** Omitted when the initiative has no mark of its own. */
  logo?: string;
  logoIsWide?: boolean;
  tags: { label: string; icon?: string }[];
  more?: number;
  badge?: string;
  /** Spans both columns of the desktop mosaic at a 1650/750 ratio. */
  wide?: boolean;
  /** The service page the initiative opens, where one exists. */
  href?: string;
  theme: CardTheme;
};

const theme = (ink: string, tint: string, edge: string): CardTheme => ({
  ink,
  tint,
  edge,
  shadow: `${ink}b3`,
});

export const navigation = [
  { label: "Home", href: "/app/home" },
  { label: "Services", href: "/app/services" },
  { label: "Application Status", href: "/app/services/application-status" },
  {
    label: "Information",
    href: "/app/home/information",
    children: [
      {
        label: "Laws and Legislation",
        href: "/app/home/information/laws-legislation",
      },
      {
        label: "Traffic Offences and Penalties",
        href: "/app/home/information/traffic-offences-and-penalties",
      },
      {
        label: "Road Speed Limits",
        href: "/app/home/information/road-speed-limits",
      },
    ],
  },
];

export const heroSlides = [
  {
    title: "Police Week across Nigeria",
    subtitle: "A week of service in every state of the federation",
    image: "/images/home/hero/parade.jpg",
  },
  {
    title: "96 Years of the Nigeria Police Force",
    subtitle: "Serving the nation since 1930",
    image: "/images/home/hero/anniversary.jpg",
  },
  {
    title: "Safe and Secure, Together",
    subtitle: "Together for a safer Nigeria tomorrow",
    image: "/images/home/hero/community.jpg",
  },
  {
    title: "Ready on Every Road",
    subtitle: "New patrol vehicles join the Force's fleet",
    image: "/images/shared/fleet.jpg",
  },
];

export const quickServices = [
  {
    title: "Make a Report",
    body: "Report a crime or submit your complaint directly",
    href: "/app/services?package=Criminal+Reports+and+Complaints",
    icon: "/icons/home/reports-and-complaints-suite.svg",
  },
  {
    title: "Apply for a Certificate or Permit",
    body: "Access official documents from the Nigeria Police Force quickly and securely",
    href: "/app/services?package=Permits+and+Certificates",
    icon: "/icons/home/request-for-a-certificate-or-permit.svg",
  },
  {
    title: "Check an Application",
    body: "Follow a POSSAP application, or check that a police document is genuine",
    href: "/app/services?package=Inquiries+and+Follow-up",
    icon: "/icons/home/inquire-and-pay.svg",
  },
  {
    title: "Get Help Now",
    body: "Call 112, or find emergency and response services",
    href: "/app/services?package=Emergency+and+Response",
    icon: "/icons/home/request-support.svg",
  },
  {
    title: "Explore More Services",
    body: "Browse and discover more available police services",
    href: "/app/services",
    icon: "/icons/home/more.svg",
  },
];

export const pillars = [
  {
    word: "Safe",
    line: "Your safety, backed by every officer on duty.",
    portrait: "/images/home/pillars/safe.jpg",
  },
  {
    word: "Secure",
    line: "Protecting every home, every family, every day.",
    portrait: "/images/home/pillars/secure.jpg",
  },
  {
    word: "Together",
    line: "Connecting hearts, building trust. Stronger as one.",
    portrait: "/images/home/pillars/together.jpg",
  },
];

export const smartPolicing: InitiativeCard[] = [
  {
    title: "Police Clearance Certificate",
    href: "/app/services/police-clearance-certificate",
    body: "Need proof you have no criminal record in Nigeria? Apply online and the certificate comes to your email, usually within 5 working days",
    image: "/images/home/smart-policing/police-clearance.jpg",
    tags: [],
    wide: true,
    theme: theme("#050F22", "#C4D8F8", "#7FB4FF"),
  },
  {
    title: "Cybercrime Reporting",
    href: "/app/services/ecrime",
    body: "The Force's National Cybercrime Centre takes reports of online fraud, phishing and cryptocurrency scams, and you can report anonymously",
    image: "/images/home/smart-policing/cybercrime-centre.jpg",
    tags: [
      {
        label: "Cybercrimes Act 2015",
      },
    ],
    more: 1,
    theme: theme("#0B1526", "#CCDCF2", "#93B9E8"),
  },
  {
    title: "Police Extract",
    href: "/app/services/lost-and-found",
    body: "Lost a document or an item? A police extract records the loss, and is often asked for when replacing one, such as a passport",
    image: "/images/home/smart-policing/lost-and-found.jpg",
    tags: [
      {
        label: "POSSAP",
      },
    ],
    more: 2,
    theme: theme("#241748", "#ebe6f7", "#ab99de"),
  },
];

export const domains = [
  {
    id: "ground",
    title: "On the Ground",
    lead: "Wherever you go, help is close by.",
    body: "Our patrols, officers and specialised units are always nearby, ready to assist whenever you need us.",
    background: "/images/home/domains/car.jpg",
    backgroundMobile: "/images/home/domains/car-mobile.jpg",
    // The reading shade takes the photo's own dusk: deep night over the wet
    // road, warm over the gold lake, open evening blue over the sky.
    shade: "8 17 34",
    chips: [
      {
        label: "Neighbourhood Security",
        icon: "/icons/shared/security.svg",
      },
      { label: "On The Go", icon: "/icons/shared/car.svg" },
      { label: "Tourist Police", icon: "/icons/home/tourist.svg" },
    ],
  },
  {
    id: "shore",
    title: "On the Water",
    lead: "Wherever you are, your safety is assured.",
    body: "The Marine Police patrol the Niger, the Benue, the creeks of the Niger Delta and the Lagos lagoons, so work and travel on the water stay safe.",
    background: "/images/home/domains/boat.jpg",
    backgroundMobile: "/images/home/domains/boat-mobile.jpg",
    shade: "30 20 12",
    chips: [{ label: "Sail Safely", icon: "/icons/home/boat.svg" }],
  },
  {
    id: "sky",
    title: "From the Sky",
    lead: "A watchful eye over the whole country.",
    body: "The Police Air Wing and our drone units watch over the country from above, holding the highest standards of security.",
    background: "/images/home/domains/drone.jpg",
    backgroundMobile: "/images/home/domains/drone-mobile.jpg",
    shade: "13 29 54",
    chips: [{ label: "Air Wing", icon: "/icons/home/drone.svg" }],
  },
];

/** One ground for every station type: they are tiers of one Command, not rival brands. */
const station = theme("#0A1526", "#C4D8F8", "#7FB4FF");

export const smartPoliceStations: InitiativeCard[] = [
  {
    title: "Force Headquarters",
    body: "Louis Edet House in Abuja, where the Inspector-General of Police directs policing across the federation.",
    image: "/images/home/smart-stations/command-headquarters.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
  {
    title: "State Commands",
    body: "A Command in each of the 36 states and the FCT, each led by a Commissioner of Police.",
    image: "/images/home/smart-stations/area-commands.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
  {
    title: "Divisional Headquarters",
    body: "Where most people meet the Force: the counter that takes a report, the investigators and the patrol teams.",
    image: "/images/home/smart-stations/divisional-headquarters.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
  {
    title: "Police Posts",
    body: "Smaller outposts in the towns and rural wards of every state. Each is held by a patrol team.",
    image: "/images/home/smart-stations/police-posts.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
  {
    title: "Marine Police Base",
    body: "Gives waterside communities a police response on the water, covering the dams, lakes and river crossings a patrol car cannot reach.",
    image: "/images/home/smart-stations/marine-police-base.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
];

export const community: InitiativeCard[] = [
  {
    title: "Police Community Relations Committee",
    body: "Sit with the PCRC at your division, raise what worries your street, and help shape how your neighbourhood is policed.",
    image: "/images/home/community/pcrc.jpg",
    tags: [{ label: "Committee Results" }],
    more: 1,
    wide: true,
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
  {
    title: "Safer Neighbourhood Watch",
    body: "Volunteer with the Nigeria Police Force to create real change. Support programmes that build trust, shared responsibility and a safer Nigeria for all. Make a difference, together!",
    image: "/images/home/community/neighbourhood-watch.jpg",
    tags: [
      {
        label: "Explore Volunteer Opportunities",
      },
    ],
    theme: theme("#0C2340", "#DDE9FF", "#B7D9FF"),
  },
  {
    title: "Police Children Schools",
    body: "A long-standing undertaking of the Force, the Nigeria Police Children Schools make sure every child of our personnel has access to good education. The schools blend academic achievement with personal growth and skills development in a supportive environment.",
    image: "/images/home/community/police-children-schools.jpg",
    tags: [{ label: "Become a Safety Ambassador" }],
    more: 2,
    theme: theme("#554937", "#ffffff", "#dcd4c9"),
  },
  {
    title: "Nigeria Police Games",
    body: "The championship of the Force, bringing officers from every Command together and carrying our message on discipline and fitness into the community",
    image: "/images/home/community/nigeria-police-games.jpg",
    badge: "Coming Soon",
    tags: [],
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
  {
    title: "Nigeria Police Museum",
    body: "A cultural landmark where the past illuminates the present, tracing the Force from its founding in 1930 to the national institution it is today",
    image: "/images/home/community/nigeria-police-museum.jpg",
    tags: [{ label: "Visit our virtual museum" }],
    theme: theme("#6A3D06", "#fef8f0", "#f9c990"),
  },
  {
    title: "West African Police Summit",
    body: "Police chiefs from across the region, alongside researchers, technology partners and civil society, meet in Abuja to share what works in investigation, forensics and community policing.",
    image: "/images/home/community/west-african-police-summit.jpg",
    tags: [
      {
        label: "Summit Awards 2026",
        icon: "/icons/home/announcement.svg",
      },
    ],
    more: 2,
    wide: true,
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
];

export const emergencyNumbers = [
  {
    label: "Police",
    number: "112",
    note: "For emergencies only",
  },
  { label: "Road Safety", number: "122", note: "" },
  { label: "Fire Service", number: "199", note: "" },
  { label: "Child Helpline", number: "116", note: "" },
];

export const footerColumns = [
  {
    heading: "Packages",
    links: [
      { label: "Inquiries and Follow-up", href: "/app/services" },
      { label: "Criminal Reports and Complaints", href: "/app/services" },
      { label: "Permits and Certificates", href: "/app/services" },
      { label: "Traffic and Accidents", href: "/app/services" },
      { label: "Business and Corporate", href: "/app/services" },
      { label: "Community Engagement", href: "/app/services" },
      { label: "Emergency and Response", href: "/app/services" },
    ],
  },
  {
    heading: "Quick links",
    links: [
      { label: "All Services", href: "/app/services" },
      { label: "Application Status", href: "/app/services/application-status" },
      { label: "Information", href: "/app/home/information" },
      { label: "My Account", href: "/app/portal" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact us", href: "/app/home/contactUs" },
      { label: "Customer Centers", href: "/app/home/customer-centers" },
      { label: "Site Map", href: "/app/home/sitemap" },
      {
        label: "Rate this service",
        href: "https://www.servicerating.gov.ng/",
        external: true,
      },
    ],
  },
  {
    heading: "Traffic",
    links: [
      {
        label: "Laws and Legislation",
        href: "/app/home/information/laws-legislation",
      },
      {
        label: "Traffic Offences and Penalties",
        href: "/app/home/information/traffic-offences-and-penalties",
      },
      {
        label: "Road Speed Limits",
        href: "/app/home/information/road-speed-limits",
      },
    ],
  },
  {
    heading: "Friendly Websites",
    links: [
      {
        label: "POSSAP",
        href: "https://possap.gov.ng/",
        external: true,
      },
      {
        label: "Federal Ministry of Interior",
        href: "https://interior.gov.ng/",
        external: true,
      },
      {
        label: "Federal Road Safety Corps",
        href: "https://frsc.gov.ng/",
        external: true,
      },
      {
        label: "NIMC",
        href: "https://nimc.gov.ng/",
        external: true,
      },
    ],
  },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/app/home/privacy-policy" },
  { label: "Terms & Conditions", href: "/app/home/terms-conditions" },
  {
    label: "Customer Service Agreement",
    href: "/app/home/customer-service-agreement",
  },
  { label: "Sitemap", href: "/app/home/sitemap" },
];

export const storeBadges = [
  { label: "App Store", src: "/badges/app-store.svg", width: 120 },
  { label: "Google Play", src: "/badges/google-play.svg", width: 135 },
  { label: "App Gallery", src: "/badges/app-gallery.svg", width: 133 },
];
