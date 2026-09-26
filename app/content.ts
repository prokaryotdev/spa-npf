/**
 * Content for the Nigeria Police Force, Federal Capital Territory Command.
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
    title: "Police Week in the Federal Capital Territory",
    subtitle: "A week of service across the Federal Capital Territory",
    image: "/npf/hero/parade.jpg",
  },
  {
    title: "96 Years of the Nigeria Police Force",
    subtitle: "Serving the nation since 1930",
    image: "/npf/hero/anniversary.jpg",
  },
  {
    title: "Safe and Secure, Together",
    subtitle: "Together for a safer Abuja tomorrow",
    image: "/npf/hero/community.jpg",
  },
  {
    title: "Ready on Every Road",
    subtitle: "The FCT Command adds new patrol vehicles to its fleet",
    image: "/npf/hero/fleet.jpg",
  },
];

export const quickServices = [
  {
    title: "Make a Report",
    body: "Report a crime or submit your complaint directly",
    href: "/app/services?package=Criminal+Reports+and+Complaints",
    icon: "/cms/homeServiceIcon/Reports_and_Complaints_Suite_2877ee8e89.svg",
  },
  {
    title: "Apply for a Certificate or Permit",
    body: "Access official documents from the Nigeria Police Force quickly and securely",
    href: "/app/services?package=Permits+and+Certificates",
    icon: "/cms/homeServiceIcon/Request_for_a_Certificate_or_Permit_f02f7b6956.svg",
  },
  {
    title: "Inquire & Pay",
    body: "Stay updated and settle your payments instantly",
    href: "/app/services?package=Inquiries+and+Follow-up",
    icon: "/cms/homeServiceIcon/Inquire_and_Pay_2177158856.svg",
  },
  {
    title: "Request Support",
    body: "Request support on-site, digitally, in seamless steps",
    href: "/app/services?package=Emergency+and+Response",
    icon: "/cms/homeServiceIcon/Request_Support_a63f371d92.svg",
  },
  {
    title: "Explore More Services",
    body: "Browse and discover more available police services",
    href: "/app/services",
    icon: "/cms/more_12a8588c06.svg",
  },
];

export const pillars = [
  {
    word: "Safe",
    line: "Your safety, backed by every officer on duty.",
    portrait: "/npf/pillar-safe.jpg",
  },
  {
    word: "Secure",
    line: "Protecting every home, every family, every day.",
    portrait: "/npf/pillar-secure.jpg",
  },
  {
    word: "Together",
    line: "Connecting hearts, building trust. Stronger as one.",
    portrait: "/npf/pillar-together.jpg",
  },
];

export const smartPolicing: InitiativeCard[] = [
  {
    title: "Cybercrime Reporting",
    href: "/app/services/ecrime",
    body: "The National Cybercrime Centre receives reports of online fraud, blackmail and identity theft, and works to keep the community safe online",
    image: "/npf/cybercrime-centre.jpg",
    tags: [
      {
        label: "Cybercrimes Act 2015",
      },
    ],
    more: 1,
    theme: theme("#0B1526", "#CCDCF2", "#93B9E8"),
  },
  {
    title: "Lost & Found",
    href: "/app/services/lost-and-found",
    body: "A paperless and secure way to find what matters, the Lost & Found desk offers a simple and reliable way to report and recover property",
    image: "/npf/lost-and-found.jpg",
    tags: [
      {
        label: "Federal Capital Territory Digital Services",
      },
    ],
    more: 2,
    theme: theme("#241748", "#ebe6f7", "#ab99de"),
  },
  {
    title: "Rescue Me",
    href: "/app/services/share-security-information",
    body: "Seen something suspicious? Report activity or incidents that could threaten public safety, or share security information with the Force. It is free, and open to residents, visitors and businesses",
    image: "/npf/rescue-me.jpg",
    tags: [
      {
        label: "National Security Strategy",
      },
    ],
    more: 1,
    wide: true,
    theme: theme("#050F22", "#C4D8F8", "#7FB4FF"),
  },
];

export const domains = [
  {
    id: "ground",
    title: "On the Ground",
    lead: "Wherever you go, help is close by.",
    body: "Our patrols, officers and specialised units are always nearby, ready to assist whenever you need us.",
    background: "/img/3d-static/car-bg.jpg",
    // The reading shade takes the photo's own dusk: deep night over the wet
    // road, warm over the gold lake, open evening blue over the sky.
    shade: "8 17 34",
    chips: [
      {
        label: "Neighbourhood Security",
        icon: "/cms/icon_security_84e1e8baef.svg",
      },
      { label: "On The Go", icon: "/cms/icon_car_eaa24290bd.svg" },
      { label: "Tourist Police", icon: "/cms/icon_tourist_a49d88a5f4.svg" },
    ],
  },
  {
    id: "shore",
    title: "On the Water",
    lead: "Wherever you are, your safety is assured.",
    body: "The Marine Police patrol Jabi Lake, the Lower Usuma Dam and the rivers around the Territory, so work and leisure on the water stay safe.",
    background: "/img/3d-static/boat-bg.jpg",
    shade: "30 20 12",
    chips: [{ label: "Sail Safely", icon: "/cms/icon_boat_3777bd658e.svg" }],
  },
  {
    id: "sky",
    title: "From the Sky",
    lead: "A watchful eye over the whole Territory.",
    body: "The Police Air Wing and our drone units watch over the Territory from above, holding the highest standards of security.",
    background: "/img/3d-static/drone-bg.jpg",
    shade: "13 29 54",
    chips: [{ label: "Air Wing", icon: "/cms/icon_drone.svg" }],
  },
];

/** One ground for every station type: they are tiers of one Command, not rival brands. */
const station = theme("#0A1526", "#C4D8F8", "#7FB4FF");

export const smartPoliceStations: InitiativeCard[] = [
  {
    title: "Command Headquarters",
    body: "Seat of the FCT Police Command at Garki, where the Commissioner of Police coordinates policing across the Territory.",
    image: "/npf/command-headquarters.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
  {
    title: "Area Commands",
    body: "Nine Area Commands, each supervising the divisions within its reach.",
    image: "/npf/area-commands.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
  {
    title: "Divisional Headquarters",
    body: "Where most people meet the Force: the counter that takes a report, the investigators and the patrol teams.",
    image: "/npf/divisional-headquarters.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
  {
    title: "Police Posts",
    body: "Smaller outposts in the satellite towns and rural wards of the six Area Councils. Each is held by a patrol team.",
    image: "/npf/police-posts.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
  {
    title: "Marine Police Base",
    body: "Gives waterside communities a police response on the water, covering the dams, lakes and river crossings a patrol car cannot reach.",
    image: "/npf/marine-police-base.jpg",
    href: "/app/home/customer-centers",
    tags: [],
    theme: station,
  },
];

export const community: InitiativeCard[] = [
  {
    title: "Police Community Relations Committee",
    body: "Sit with the PCRC at your division, raise what worries your street, and help shape how your neighbourhood is policed.",
    image: "/npf/pcrc.jpg",
    tags: [{ label: "Committee Results" }],
    more: 1,
    wide: true,
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
  {
    title: "Safer Neighbourhood Watch",
    body: "Volunteer with the Nigeria Police Force to create real change. Support programmes that build trust, shared responsibility and a safer Territory for all. Make a difference, together!",
    image: "/npf/neighbourhood-watch.jpg",
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
    image: "/npf/police-children-schools.jpg",
    tags: [{ label: "Become a Safety Ambassador" }],
    more: 2,
    theme: theme("#554937", "#ffffff", "#dcd4c9"),
  },
  {
    title: "Nigeria Police Games",
    body: "The championship of the Force, bringing officers from every Command together and carrying our message on discipline and fitness into the community",
    image: "/npf/nigeria-police-games.jpg",
    badge: "Coming Soon",
    tags: [],
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
  {
    title: "Nigeria Police Museum",
    body: "A cultural landmark where the past illuminates the present, tracing the Force from its founding in 1930 to the national institution it is today",
    image: "/npf/nigeria-police-museum.jpg",
    tags: [{ label: "Visit our virtual museum" }],
    theme: theme("#6A3D06", "#fef8f0", "#f9c990"),
  },
  {
    title: "West African Police Summit",
    body: "Police chiefs from across the region, alongside researchers, technology partners and civil society, meet in Abuja to share what works in investigation, forensics and community policing.",
    image: "/npf/west-african-police-summit.jpg",
    tags: [
      {
        label: "Summit Awards 2026",
        icon: "/cms/announcement_01_9b8b72d1a1.svg",
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
  { label: "App Store", src: "/img/app-store.svg", width: 120 },
  { label: "Google Play", src: "/img/google-play.svg", width: 135 },
  { label: "App Gallery", src: "/img/app-gallery.svg", width: 133 },
];
