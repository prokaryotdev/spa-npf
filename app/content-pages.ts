/**
 * Copy and assets for the five main navigation pages, captured from the live
 * site the same way the homepage was.
 */

export const aboutUs = {
  title: "About Us",
  heroImage: "/img/about-img.png",
  heroCaption:
    "Dubai Police began its operations at Naif Fort with only 29 officers before relocating to its current headquarters in Al Tawar in 1973. Today, Dubai Police employ more than 32,000 highly qualified personnel operating through an extensive network of police stations across the emirate.",
  history: {
    heading:
      "From humble beginnings to a global leader in policing innovation.",
    body: "We, Dubai Police, are proud to be a modern Arab police force of more than fifteen thousand highly specialised and trained personnel. We are also proud to be recognised as one of the leading security institutions locally, regionally, and globally.",
    image: "/img/history.jpg",
  },
  journey: {
    lines: ["A journey", "of innovation, excellence,", "and community trust."],
    video: "/img/dp-journey.webm",
  },
  strategy: {
    heading: "Our Strategy",
    image: "/img/our-strategy.jpg",
    points: [
      "Building strategic partnerships at local and international levels to enhance joint efforts in combating crime.",
      "Advancing digital transformation to deliver smart, proactive, and highly efficient services aligned with the best global practices and standards.",
      "Developing highly skilled national security personnel capable of reinforcing Dubai’s reputation for effective crisis and disaster response.",
      "Formulating progressive policies and legislation that reinforce the foundations of security and safety for a stable and prosperous society.",
      "Establishing an innovative security model driven by artificial intelligence tools to maintain public safety and social well-being.",
      "Implementing effective governance frameworks that promote transparency, efficiency, and institutional excellence.",
    ],
  },
  pillars: [
    {
      heading: "Vision",
      body: "Police Pioneering for a Safe City",
      image: "/img/vision.jpg",
    },
    {
      heading: "Mission",
      body: "We strive to make Dubai the city of security & sustainable safety through providing innovative smart service, global institutional excellence in an environment that promotes innovation and creativity aiming for community happiness",
      image: "/img/mission.jpg",
    },
    {
      heading: "Values",
      body: "Positivity, Objectivity, Justice, Transparency, Teamwork",
      image: "/img/value.jpg",
    },
  ],
  structureLink: {
    label: "Organizational Structure",
    href: "/app/home/aboutus/organisational-structure",
  },
};

export const openData = {
  title: "Open Data",
  cards: [
    {
      title: "Data Dubai",
      body: "Find official city-data and statistics to track key indicators that shape decisions, drive innovation, and build a smarter future for everyone.",
      cta: "Know more",
      image: "/img/openData/Dubai-Pulse.jpg",
      href: "https://www.dubaipulse.gov.ae/",
    },
  ],
};

export const information = {
  title: "Information",
  cards: [
    {
      title: "Laws & Legislation",
      body: "Our Laws and Legal Frameworks",
      cta: "Know more",
      image: "/img/information/Laws-and-legislation.jpg",
      href: "/app/home/information/laws-legislation",
    },
    {
      title: "Black Points of Traffic Violations",
      body: "Learn how black points and fines impact your traffic record.",
      cta: "Know more",
      image: "/img/information/blackpoints.jpg",
      href: "/app/home/information/view-black-points-traffic-violations",
    },
    {
      title: "Street Speed Limits",
      body: "Dubai applies specific speed limits across its roads to ensure safety and smooth traffic flow. These limits vary depending on the type of road and location",
      cta: "Know more",
      image: "/img/information/Street-Speed-Limits.jpg",
      href: "/app/home/information/street-speed-limits",
    },
    {
      title: "Best Practices in Sustainable Development",
      body: "Know more about how Dubai Police is driving innovation to achieve a sustainable future.",
      cta: "Know more",
      image: "/img/information/Sustainable-Development.jpg",
      href: "/app/home/information/sustainability",
    },
  ],
};

export const mediaHub = {
  title: "Media",
  intro:
    "Stay up to date! Whether you are seeking the latest news or simply browsing our events and features, the Media Hub provides the resources necessary to keep you informed and involved.",
  campaigns: [
    { title: "SMART SECURE TOGETHER", image: "/cms/slide2_642a5cdf68.jpg" },
    {
      title: "Police Innovation and Leadership",
      image: "/cms/Home/Innovation_2d3f3540e6.jpg",
    },
    {
      title: "Luxury Meets Readiness",
      image: "/cms/Home/Tesla_fdb5e10caf.jpg",
    },
    {
      title: "70th Anniversary of Dubai Police",
      image:
        "/cms/70_years_of_Dubai_Police_Visual_V1_Website_V1_d1499023bc.jpeg",
    },
    {
      title: "Arabian Travel Market Exhibition",
      image: "/cms/Website_Banner_d3a5662877.jpg",
    },
  ],
  events: [
    {
      title: "Arabian Travel Market",
      date: "13 Sep, 2026",
      status: "Upcoming" as const,
      image: "/cms/events/9_991c7e17aa.jpg",
    },
    {
      title: "Dubai Mallathon",
      date: "15 Jun, 2026",
      status: "Upcoming" as const,
      image: "/cms/events/552_dc9f0d06fd.jpg",
    },
    {
      title: "Game Expo 2026",
      date: "03 Jun, 2026",
      status: "Expired" as const,
      image: "/cms/events/GX_5f81069f3f.jpg",
    },
    {
      title: "International Day of Yoga",
      date: "24 Jun, 2023",
      status: "Expired" as const,
      image: "/cms/events/4047_24_21a9beb647.jpg",
    },
    {
      title: "DUBAI ESPORTS AND GAMES FESTIVAL",
      date: "21 Jun, 2023",
      status: "Expired" as const,
      image: "/cms/events/8501_def_6202350af9.jpg",
    },
  ],
  news: {
    intro:
      "Keep informed! Browse our latest news, learn about ongoing initiatives, and see how innovation continues to drive our work.",
    items: [
      {
        title:
          "Dubai Police Surpasses Resource Rationalisation Target with 99.6% Budget Compliance",
        date: "Sep 13, 2026",
        image: "/cms/news/medium_344_9a36eeaafa.jpg",
      },
      {
        title:
          "Discover How Dubai Police Makes Your Dubai Visit Safer and Smarter at ATM 2026",
        date: "Sep 12, 2026",
        image: "/cms/news/medium_234324_3a221ae32f.jpg",
      },
      {
        title:
          "Dubai Police Identifies 100 Future Opportunities to Strengthen Security and Quality of Life",
        date: "Sep 12, 2026",
        image: "/cms/news/medium_6876_13d253e78a.jpg",
      },
      {
        title:
          "Dubai Police Signs Agreement to Advance Autonomous Marine Systems and Innovation",
        date: "Sep 11, 2026",
        image: "/cms/news/medium_434_28a6bebbcc.jpg",
      },
      {
        title:
          "Dubai Confirms Security Readiness for Arab Media Summit and Arabian Travel Market 2026",
        date: "Sep 11, 2026",
        image: "/cms/news/medium_757_6da8ac2c8e.jpg",
      },
      {
        title:
          "Beyond the Uniform: Dubai Police Celebrates Women Balancing Careers and Motherhood",
        date: "Sep 11, 2026",
        image: "/cms/news/medium_786_478442fc4c.jpg",
      },
    ],
  },
  videos: {
    heading: "Video Gallery",
    body: "Policing today, shaping tomorrow. View our video gallery to explore major operations, next-generation technologies, and memorable moments from our community.",
    cta: "Explore All Videos",
  },
  photos: {
    heading: "Photos",
    cta: "Explore All Photos",
    albums: [
      {
        title: "FOURTH GRADUATION CEREMONY OF HEMAYA SCHOOL",
        date: "2026-07-09",
        count: 5,
        image: "/cms/gallery/11111_efd6b6445a.jpg",
      },
      {
        title: "ISNR Abu Dhabi 2026",
        date: "2026-05-19",
        count: 5,
        image: "/cms/gallery/111_03d57a65e2.jpg",
      },
      {
        title: "SIKKA ART & DESIGN FESTIVAL",
        date: "2026-01-23",
        count: 5,
        image: "/cms/World_Summit_Police_30fd9f4d13.jpg",
      },
    ],
  },
};

export const applicationStatus = {
  title: "Application Status",
  fees: "Free of Charge",
  duration: "Instant",
  body: "This service allows users to track the status of their application using the reference number.",
  signInLabel: "Sign in using UAE Pass",
  beneficiaries: ["Individuals"],
  channels: [
    "Dubai Police App",
    "Dubai Police Website",
    "Smart Police Stations",
  ],
  hours: [
    { label: "Digital Channels", value: "24/7" },
    { label: "Police Station", value: "7:30 - 22:00" },
    { label: "Smart Police Stations", value: "24/7" },
  ],
  contact: [
    { label: "Call Center", value: "901", href: "tel:901" },
    {
      label: "Email",
      value: "mail@dubaipolice.gov.ae",
      href: "mailto:mail@dubaipolice.gov.ae",
    },
    { label: "P.O. Box", value: "1493 Dubai - United Arab Emirates" },
  ],
};
