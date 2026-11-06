const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new DatabaseSync(dbPath);

console.log('Seeding SQLite database at:', dbPath);

// Enable WAL mode & foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// 1. ADMIN USERS
console.log('Seeding Users...');
const insertUser = db.prepare(`
  INSERT OR REPLACE INTO User (id, email, passwordHash, name, role, active, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

const superAdminHash = hashPassword('Admin@Balochistan2026!');
const editorHash = hashPassword('Editor@Balochistan2026!');
const grievanceHash = hashPassword('Grievance@Balochistan2026!');

insertUser.run('usr-admin-1', 'admin@balochistan.gov.pk', superAdminHash, 'Chief Minister Secretariat Administrator', 'SUPER_ADMIN');
insertUser.run('usr-editor-1', 'editor@balochistan.gov.pk', editorHash, 'Information & Media Officer', 'EDITOR');
insertUser.run('usr-grm-1', 'grievance@balochistan.gov.pk', grievanceHash, 'CM Complaint Cell Director', 'GRIEVANCE_OFFICER');

// 2. CHIEF MINISTER PROFILE
console.log('Seeding Chief Minister Profile...');
const insertCM = db.prepare(`
  INSERT OR REPLACE INTO ChiefMinisterProfile (
    id, nameEn, nameUr, titleEn, titleUr, welcomeMessageEn, welcomeMessageUr,
    quoteEn, quoteUr, bioParagraphsEn, bioParagraphsUr, photoUrl,
    inOfficeSince, party, assembly, residence, termLength, active, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
`);

const cmBio = [
  "Mir Sarfraz Bugti assumed office as the Chief Minister of Balochistan on 2 March 2024, following his election by the Provincial Assembly. He has devoted his public career to the province's development, security and social uplift.",
  "His agenda places people at the centre of government: expanding access to health and education, creating dignified work for young people, strengthening local institutions, and unlocking the potential of Balochistan's land, coast, minerals and culture.",
  "The Chief Minister has emphasised transparent, accountable governance and a service-delivery model that reaches every district — from the coastal belt of Gwadar and Makran to the highlands of Quetta, Zhob and Kalat."
];

insertCM.run(
  'cm-profile-sarfraz-bugti',
  'Mir Sarfraz Bugti',
  'میر سرفراز بگٹی',
  'Chief Minister of Balochistan',
  'وزیراعلیٰ بلوچستان',
  'Welcome to the official website of the Chief Minister’s Office. Our government is committed to serving the people through transparent governance, effective public service delivery, institutional reforms, and sustainable development. We aim to strengthen public institutions, improve essential services, and create opportunities for progress and prosperity. Through people-centered policies and responsible leadership, we strive to build a better future for every citizen.',
  'وزیراعلیٰ ہاؤس بلوچستان کے سرکاری پورٹل پر خوش آمدید۔ ہماری حکومت شفاف طرز حکمرانی، عوامی خدمت اور پائیدار ترقی کے عزم کے ساتھ صوبے کے ہر شہری کے حقوق کے تحفظ کے لیے کوشاں ہے۔',
  "Balochistan's greatest resource is its people. Our task is to turn distance into opportunity — and promise into progress.",
  'بلوچستان کا سب سے بڑا اثاثہ اس کے غیرت مند عوام ہیں۔ ہمارا مقصد فاصلوں کو مواقع اور وعدوں کو ترقی میں بدلنا ہے۔',
  JSON.stringify(cmBio),
  JSON.stringify([
    'میر سرفراز بگٹی نے 2 مارچ 2024 کو صوبائی اسمبلی کے انتخابات میں کامیابی کے بعد وزیراعلیٰ بلوچستان کا منصب سنبھالا۔',
    'ان کی ترجیحات میں تعلیم، صحت، روزگار اور بلوچستان کے ساحل و وسائل کی ترقی سرفہرست ہے۔'
  ]),
  '/images/chief-minister-portrait.jpg',
  '2 March 2024',
  'Pakistan Peoples Party',
  'Provincial Assembly of Balochistan (PB-10 Dera Bugti)',
  'Chief Minister House, Zarghoon Road, Quetta',
  'Five years'
);

// 3. VISION & MISSION
console.log('Seeding Vision & Mission...');
const insertVision = db.prepare(`
  INSERT OR REPLACE INTO VisionMission (id, visionEn, visionUr, missionEn, missionUr, updatedAt)
  VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
`);

insertVision.run(
  'vision-mission-main',
  'To build a prosperous, peaceful, inclusive, and developed province where every citizen has access to opportunities, quality public services, and an improved standard of living.',
  'ایک خوشحال، پرامن، جامع اور ترقی یافتہ صوبہ جہاں ہر شہری کو یکساں مواقع اور معیاری زندگی میسر ہو۔',
  'To promote transparent governance, strengthen public institutions, improve service delivery, encourage sustainable development, and ensure that citizens’ concerns are addressed effectively.',
  'شفاف طرز حکمرانی، اداروں کی مضبوطی، اور فوری عوامی شکایات کا ازالہ یقینی بنانا۔'
);

// 4. DAY-ONE IMMEDIATE PRIORITIES
console.log('Seeding Day-One & Sectoral Priorities...');
const insertPriority = db.prepare(`
  INSERT OR REPLACE INTO Priority (
    id, slug, titleEn, titleUr, shortEn, shortUr, descriptionEn, descriptionUr,
    icon, initiativesJson, sortOrder, isFirstDay, active, createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

const dayOnePriorities = [
  {
    id: "p-good-governance",
    slug: "good-governance",
    title: "Good Governance & Administrative Reforms",
    short: "Merit and efficiency across all provincial departments",
    desc: "Streamlining government machinery, merit-based public appointments, and eliminating procedural bottlenecks across all departments.",
    icon: "landmark",
    initiatives: ["Digitized civil service records", "Key Performance Indicators for Secretaries", "Paperless Secretariat rollout"],
    order: 1,
  },
  {
    id: "p-law-order",
    slug: "law-order",
    title: "Law and Order",
    short: "Rule of law and community safety",
    desc: "Strengthening community safety, modernizing police resources, and ensuring rule of law across every division and district.",
    icon: "shield",
    initiatives: ["Safe City Quetta expansion", "Modernized border district policing", "Rapid Highway Patrol units"],
    order: 2,
  },
  {
    id: "p-health-education",
    slug: "health-education",
    title: "Healthcare and Education",
    short: "Upgrading hospitals and ghost school eradication",
    desc: "Emergency care facilities at district hospitals, teacher attendance monitoring, and quality free schooling for every child.",
    icon: "heart",
    initiatives: ["Zero-tolerance ghost schools policy", "Biometric teacher attendance", "Round-the-clock emergency hospital cover"],
    order: 3,
  },
  {
    id: "p-service-delivery",
    slug: "service-delivery",
    title: "Public Service Delivery",
    short: "Civic utilities and clean drinking water",
    desc: "Bringing vital public utilities, clean drinking water, sanitation, and municipal facilitation to citizens' doorsteps.",
    icon: "globe",
    initiatives: ["Clean drinking water emergency plan", "Municipal solid waste collection", "District facilitation centers"],
    order: 4,
  },
  {
    id: "p-infrastructure",
    slug: "infrastructure",
    title: "Development and Infrastructure",
    short: "Highways, solar energy and farm-to-market links",
    desc: "Upgrading inter-district highway connectivity, rural farm-to-market roads, solar power, and port transit logistics.",
    icon: "compass",
    initiatives: ["Quetta-Karachi dualization acceleration", "500MW solar grid feeds", "Gwadar port road logistics"],
    order: 5,
  },
  {
    id: "p-employment",
    slug: "employment",
    title: "Employment & Economic Opportunities",
    short: "Youth freelancing and vocational technical skills",
    desc: "Youth skills development, vocational centers, enterprise grants, and sustainable job creation in minerals and fisheries.",
    icon: "trending",
    initiatives: ["20,000 digital freelancing scholarships", "Technical vocational diplomas", "Artisanal fisheries grants"],
    order: 6,
  },
  {
    id: "p-grm-priority",
    slug: "grm-priority",
    title: "Public Grievance Redressal",
    short: "Direct citizen complaint resolution cell",
    desc: "Direct citizen complaint redressal mechanism operating with time-bound departmental accountability and resolution tracking.",
    icon: "message",
    initiatives: ["Central 24/7 Helpline", "SMS status tracking for all complaints", "Cabinet weekly grievance review"],
    order: 7,
  },
  {
    id: "p-accountability",
    slug: "accountability",
    title: "Accountability and Transparency",
    short: "E-procurement and zero tolerance for corruption",
    desc: "Open procurement tenders, digitized provincial expenditure, and zero tolerance for institutional corruption.",
    icon: "shield",
    initiatives: ["Mandatory e-tendering for public works", "Public expenditure dashboards", "Third-party audit oversight"],
    order: 8,
  },
];

dayOnePriorities.forEach((p) => {
  insertPriority.run(
    p.id,
    p.slug,
    p.title,
    null,
    p.short,
    null,
    p.desc,
    null,
    p.icon,
    JSON.stringify(p.initiatives),
    p.order,
    1
  );
});

// 5. CORE INITIATIVES
console.log('Seeding Core Initiatives...');
const insertInitiative = db.prepare(`
  INSERT OR REPLACE INTO Initiative (
    id, titleEn, titleUr, category, descriptionEn, descriptionUr,
    status, progressPercent, featured, sortOrder, active, createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

const coreInits = [
  {
    id: "init-green-bus",
    title: "Green Bus Service Quetta",
    cat: "Public Transportation",
    desc: "Promoting affordable, accessible, and environmentally friendly public transportation to improve daily mobility and urban connectivity.",
    status: "Active",
    prog: 95,
    order: 1,
  },
  {
    id: "init-pink-bus",
    title: "Pink Bus Women Transit Initiative",
    cat: "Public Transportation",
    desc: "Dedicated safe, subsidized public transport reserved exclusively for women students, teachers, and working professionals in Quetta.",
    status: "Active",
    prog: 85,
    order: 2,
  },
  {
    id: "init-healthcare",
    title: "Healthcare Improvement & Sehat Card",
    cat: "Public Health",
    desc: "Strengthening public healthcare facilities, mobile health units in remote union councils, and 24/7 emergency response at district hospitals.",
    status: "Active",
    prog: 80,
    order: 3,
  },
  {
    id: "init-digital-skills",
    title: "Youth Digital Freelancing Programme",
    cat: "Education & Youth",
    desc: "Expanding educational access, tech freelancing training for 20,000 young people, and modern facilities in rural girls' schools.",
    status: "Active",
    prog: 70,
    order: 4,
  },
  {
    id: "init-digital-gov",
    title: "Digital Balochistan & E-Office Secretariat",
    cat: "Digital Governance",
    desc: "Promoting digital public services, citizen grievance portals, streamlined administrative processes, and open access to government data.",
    status: "Active",
    prog: 65,
    order: 5,
  },
  {
    id: "init-solar-water",
    title: "Solar Irrigation & Clean Water Desalination",
    cat: "Civic Infrastructure",
    desc: "Priority development projects in solar agricultural tube wells, clean drinking water filtration plants, and community welfare funds.",
    status: "Active",
    prog: 75,
    order: 6,
  },
];

coreInits.forEach((init) => {
  insertInitiative.run(
    init.id,
    init.title,
    null,
    init.cat,
    init.desc,
    null,
    init.status,
    init.prog,
    1,
    init.order
  );
});

// 6. CABINET MEMBERS
console.log('Seeding Cabinet Members...');
const insertCabinet = db.prepare(`
  INSERT OR REPLACE INTO CabinetMember (
    id, nameEn, nameUr, designationEn, designationUr, portfolioEn, portfolioUr,
    ministryEn, ministryUr, photoUrl, departmentUrl, sortOrder, active, createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

const cabinetMembers = [
  {
    id: "cab-cm",
    name: "Mir Sarfraz Bugti",
    desig: "Chief Minister",
    port: "Law & Order, S&GAD, Planning & Development",
    min: "Chief Minister's Secretariat",
    photo: "/images/chief-minister-portrait.jpg",
    url: "https://balochistan.gov.pk",
    order: 1,
  },
  {
    id: "cab-pnd",
    name: "Mir Zahoor Ahmed Buledi",
    desig: "Provincial Minister",
    port: "Planning and Development",
    min: "Planning & Development Department",
    photo: null,
    url: "https://pnd.balochistan.gov.pk",
    order: 2,
  },
  {
    id: "cab-fin",
    name: "Mir Shoaib Nosherwani",
    desig: "Provincial Minister",
    port: "Finance",
    min: "Finance Department",
    photo: null,
    url: "https://finance.balochistan.gov.pk",
    order: 3,
  },
  {
    id: "cab-home",
    name: "Mir Ziaullah Langau",
    desig: "Provincial Minister",
    port: "Home & Tribal Affairs",
    min: "Home and Tribal Affairs Department",
    photo: null,
    url: "https://balochistan.gov.pk",
    order: 4,
  },
  {
    id: "cab-phe",
    name: "Noor Mohammad Dummar",
    desig: "Provincial Minister",
    port: "Public Health Engineering",
    min: "PHE Department",
    photo: null,
    url: "https://balochistan.gov.pk",
    order: 5,
  },
  {
    id: "cab-cw",
    name: "Sardar Abdul Rehman Khetran",
    desig: "Provincial Minister",
    port: "Communication, Works & Physical Planning",
    min: "C&W Department",
    photo: null,
    url: "https://balochistan.gov.pk",
    order: 6,
  },
  {
    id: "cab-agri",
    name: "Saleem Ahmed Khosa",
    desig: "Provincial Minister",
    port: "Agriculture and Cooperative",
    min: "Agriculture Department",
    photo: null,
    url: "https://balochistan.gov.pk",
    order: 7,
  },
  {
    id: "cab-water",
    name: "Ali Madad Jattak",
    desig: "Provincial Minister",
    port: "Agriculture & Water Resources",
    min: "Provincial Ministry",
    photo: null,
    url: "https://balochistan.gov.pk",
    order: 8,
  },
  {
    id: "cab-live",
    name: "Bakht Muhammad Kakar",
    desig: "Provincial Minister",
    port: "Livestock & Dairy Development",
    min: "Livestock Department",
    photo: null,
    url: "https://balochistan.gov.pk",
    order: 9,
  },
];

cabinetMembers.forEach((m) => {
  insertCabinet.run(
    m.id,
    m.name,
    null,
    m.desig,
    null,
    m.port,
    null,
    m.min,
    null,
    m.photo,
    m.url,
    m.order
  );
});

// 7. FORMER CHIEF MINISTERS
console.log('Seeding Former Chief Ministers...');
const insertFormerCM = db.prepare(`
  INSERT OR REPLACE INTO FormerChiefMinister (
    id, nameEn, nameUr, partyEn, partyUr, fromDate, toDate, note, sortOrder, createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

const formerCMs = [
  { name: "Ataullah Mengal", party: "National Awami Party", from: "1 May 1972", to: "13 Feb 1973" },
  { name: "Jam Ghulam Qadir Khan", party: "Pakistan Peoples Party", from: "27 Apr 1973", to: "31 Dec 1975" },
  { name: "Mohammad Khan Barozai", party: "Pakistan Peoples Party", from: "7 Dec 1976", to: "5 Jul 1977" },
  { name: "Jam Ghulam Qadir Khan", party: "Independent", from: "6 Apr 1985", to: "29 May 1988" },
  { name: "Zafarullah Khan Jamali", party: "Islami Jamhoori Ittehad", from: "24 Jun 1988", to: "24 Dec 1988" },
  { name: "Nawab Akbar Khan Bugti", party: "Jamhoori Watan Party", from: "5 Feb 1989", to: "7 Aug 1990" },
  { name: "Taj Muhammad Jamali", party: "Islami Jamhoori Ittehad", from: "17 Nov 1990", to: "22 May 1993" },
  { name: "Zulfikar Ali Magsi", party: "Pakistan Peoples Party", from: "20 Oct 1993", to: "9 Nov 1996" },
  { name: "Akhtar Mengal", party: "Balochistan National Party (M)", from: "22 Feb 1997", to: "29 Jul 1998" },
  { name: "Mir Jan Mohammad Jamali", party: "Pakistan Muslim League (N)", from: "13 Aug 1998", to: "12 Oct 1999" },
  { name: "Jam Mohammad Yousaf", party: "Pakistan Muslim League (Q)", from: "1 Dec 2002", to: "19 Nov 2007" },
  { name: "Nawab Aslam Raisani", party: "Pakistan Peoples Party", from: "9 Apr 2008", to: "13 Jan 2013" },
  { name: "Abdul Malik Baloch", party: "National Party", from: "7 Jun 2013", to: "23 Dec 2015" },
  { name: "Sanaullah Khan Zehri", party: "Pakistan Muslim League (N)", from: "24 Dec 2015", to: "9 Jan 2018" },
  { name: "Abdul Quddus Bizenjo", party: "Pakistan Muslim League (Q)", from: "13 Jan 2018", to: "7 Jun 2018" },
  { name: "Jam Kamal Khan", party: "Balochistan Awami Party", from: "19 Aug 2018", to: "24 Oct 2021" },
  { name: "Abdul Quddus Bizenjo", party: "Balochistan Awami Party", from: "29 Oct 2021", to: "18 Aug 2023" },
  { name: "Mir Sarfraz Bugti", party: "Pakistan Peoples Party", from: "2 Mar 2024", to: "Incumbent", note: "Current Chief Minister" },
];

formerCMs.forEach((cmItem, index) => {
  insertFormerCM.run(
    `fcm-${index + 1}`,
    cmItem.name,
    null,
    cmItem.party,
    null,
    cmItem.from,
    cmItem.to,
    cmItem.note || null,
    index + 1
  );
});

// 8. NEWS ARTICLES
console.log('Seeding News Articles...');
const insertNews = db.prepare(`
  INSERT OR REPLACE INTO NewsArticle (
    id, slug, titleEn, titleUr, excerptEn, excerptUr, bodyEn, bodyUr,
    category, publishedDate, readTime, isPublished, isFeatured, createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

const newsItems = [
  {
    slug: "gwadar-development-review",
    title: "Chief Minister reviews progress on Gwadar development projects",
    excerpt: "A high-level review examined timelines for water supply, fisheries infrastructure and the new vocational institute in Gwadar.",
    category: "Development Projects",
    date: "2026-10-12T10:00:00Z",
    readTime: "3 min read",
    body: "QUETTA — The Chief Minister chaired a high-level meeting to review the implementation of development projects in Gwadar, with a focus on water supply, fisheries infrastructure and skills training for local residents.\n\nOfficials briefed the meeting on the completion of the first phase of the Gwadar water augmentation scheme, which will add a significant volume of safe drinking water to the city's supply. The Chief Minister directed that remaining distribution work be completed on schedule and that outages be communicated transparently to residents.\n\nThe meeting also reviewed progress on the modern fisheries harbour and cold-chain facilities, designed to reduce post-harvest losses and increase the value of the catch retained in Balochistan.",
    featured: 1,
  },
  {
    slug: "sehat-card-expansion",
    title: "Provincial cabinet approves expansion of Sehat Card coverage",
    excerpt: "More families will be able to access free inpatient treatment at empanelled public and private hospitals across the province.",
    category: "Public Welfare Initiatives",
    date: "2026-09-28T09:30:00Z",
    readTime: "2 min read",
    body: "QUETTA — The provincial cabinet has approved an expansion of the Sehat Card programme, widening eligibility and increasing the annual coverage available to enrolled families.\n\nThe scheme allows eligible residents to receive free inpatient treatment at a network of empanelled public and private hospitals, including specialist care that is not available in their home district.",
    featured: 1,
  },
  {
    slug: "digital-skills-programme",
    title: "Balochistan launches digital skills programme for 10,000 youth",
    excerpt: "The programme will offer free training in freelancing, web development, data entry and digital marketing across all divisions.",
    category: "Policy Announcements",
    date: "2026-09-15T11:00:00Z",
    readTime: "3 min read",
    body: "QUETTA — A new provincial digital skills programme will train 10,000 young people in freelancing, web development, data entry and digital marketing over the coming year.\n\nCourses will be delivered through government colleges and partner training centres in each division, with a mix of in-person and online instruction. Participants will receive certification and support to find their first clients.",
    featured: 0,
  },
  {
    slug: "new-girls-schools-zhob-khuzdar",
    title: "New girls' schools open in Zhob and Khuzdar",
    excerpt: "Two newly constructed schools will provide safe, modern learning spaces for more than 1,200 students.",
    category: "Development Projects",
    date: "2026-09-02T08:00:00Z",
    readTime: "2 min read",
    body: "ZHOB — Two newly constructed girls' schools have opened in Zhob and Khuzdar districts, providing modern classrooms, science laboratories, libraries and safe transport for more than 1,200 students.\n\nThe schools are part of a provincial programme to reduce overcrowding and improve the learning environment in underserved areas. Each campus includes accessible facilities, clean water and solar power.",
    featured: 0,
  },
  {
    slug: "solar-irrigation-naseerabad",
    title: "Solar irrigation initiative reaches 500 farms in Naseerabad",
    excerpt: "Farmers report lower fuel costs and more reliable water as solar-powered pumps replace diesel generators.",
    category: "Public Welfare Initiatives",
    date: "2026-08-18T14:00:00Z",
    readTime: "3 min read",
    body: "NASEERABAD — A provincial initiative to convert agricultural tube wells to solar power has now reached 500 farms in the Naseerabad division, with farmers reporting significantly lower operating costs.\n\nThe programme provides subsidised solar pumping systems, technical training and maintenance support. It is expected to reduce diesel consumption and help farmers cope with rising energy prices.",
    featured: 0,
  },
  {
    slug: "quetta-heritage-corridor",
    title: "Quetta's Liaquat Bazaar heritage corridor restored",
    excerpt: "A restored market corridor combines heritage facades, improved pedestrian access and space for local artisans.",
    category: "Visits and Events",
    date: "2026-07-30T16:00:00Z",
    readTime: "2 min read",
    body: "QUETTA — The restored heritage corridor at Liaquat Bazaar was opened to the public this week, combining conserved facades with wider pedestrian walkways, lighting and dedicated space for local artisans.\n\nThe project was designed with input from traders, historians and residents, and aims to protect the character of one of Quetta's oldest commercial areas while improving safety and accessibility.",
    featured: 0,
  },
];

newsItems.forEach((n, idx) => {
  insertNews.run(
    `news-${idx + 1}`,
    n.slug,
    n.title,
    null,
    n.excerpt,
    null,
    n.body,
    null,
    n.category,
    n.date,
    n.readTime,
    n.featured
  );
});

// 9. WEBSITE SETTINGS
console.log('Seeding Website Settings...');
const insertSetting = db.prepare(`
  INSERT OR REPLACE INTO WebsiteSetting (id, key, valueEn, valueUr, category, updatedAt)
  VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
`);

const settings = [
  { key: "site_name", valEn: "Office of the Chief Minister of Balochistan", valUr: "دفتر وزیراعلیٰ بلوچستان", cat: "general" },
  { key: "cm_office_phone", valEn: "+92 81 920 1234", valUr: "+92 81 920 1234", cat: "contact" },
  { key: "complaint_helpline", valEn: "1122 / 081-9201500", valUr: "1122 / 081-9201500", cat: "contact" },
  { key: "official_email", valEn: "info@cm.balochistan.gob.pk", valUr: "info@cm.balochistan.gob.pk", cat: "contact" },
  { key: "complaint_email", valEn: "complaints@cm.balochistan.gob.pk", valUr: "complaints@cm.balochistan.gob.pk", cat: "contact" },
  { key: "secretariat_address", valEn: "Chief Minister House, Zarghoon Road, Quetta, Balochistan", valUr: "وزیراعلیٰ ہاؤس، زرغون روڈ، کوئٹہ، بلوچستان", cat: "general" },
  { key: "portal_tagline", valEn: "A stronger, fairer and more prosperous Balochistan.", valUr: "ایک مضبوط، باوقار اور خوشحال بلوچستان۔", cat: "general" },
];

settings.forEach((s, idx) => {
  insertSetting.run(`set-${idx + 1}`, s.key, s.valEn, s.valUr, s.cat);
});

// 10. DEMO COMPLAINTS & AUDIT LOGS
console.log('Seeding Demo Complaints & Audit Logs...');
const insertComplaint = db.prepare(`
  INSERT OR REPLACE INTO Complaint (
    id, trackingCode, citizenName, citizenPhone, citizenEmail, district,
    category, department, description, status, priorityLevel, resolutionNotes,
    resolvedAt, createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
`);

const insertHistory = db.prepare(`
  INSERT OR REPLACE INTO ComplaintStatusHistory (
    id, complaintId, previousStatus, newStatus, changedById, comments, createdAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertComplaint.run(
  'cmp-demo-1',
  'CMB-2026-1001',
  'Abdul Wahid Baloch',
  '03001234567',
  'abdul.wahid@example.com',
  'Quetta',
  'Water & Public Health',
  'Public Health Engineering Department',
  'Main distribution pipeline damaged on Brewery Road causing water supply disruption to 200+ households for the past 4 days.',
  'IN_PROGRESS',
  'HIGH',
  'Repair team dispatched from PHE Sub-Division Quetta Central with replacement coupling valves.',
  null,
  '2026-10-20 10:15:00'
);

insertHistory.run(
  'csh-1',
  'cmp-demo-1',
  null,
  'SUBMITTED',
  null,
  'Grievance registered via official web portal and tracking code issued.',
  '2026-10-20 10:15:00'
);

insertHistory.run(
  'csh-2',
  'cmp-demo-1',
  'SUBMITTED',
  'UNDER_REVIEW',
  'usr-grm-1',
  'Initial review completed by Grievance Redressal Officer; flagged as High Priority.',
  '2026-10-20 11:30:00'
);

insertHistory.run(
  'csh-3',
  'cmp-demo-1',
  'UNDER_REVIEW',
  'ASSIGNED',
  'usr-grm-1',
  'Assigned to Executive Engineer PHE Division Quetta for immediate on-site repair.',
  '2026-10-20 14:00:00'
);

insertHistory.run(
  'csh-4',
  'cmp-demo-1',
  'ASSIGNED',
  'IN_PROGRESS',
  'usr-admin-1',
  'PHE maintenance crew on site; excavation and pipe replacement in active progress.',
  '2026-10-21 09:00:00'
);

// Demo complaint 2 - Resolved
insertComplaint.run(
  'cmp-demo-2',
  'CMB-2026-1002',
  'Bibi Fatima Mengal',
  '03337654321',
  null,
  'Khuzdar',
  'Healthcare & Hospitals',
  'Health Department',
  'Absence of duty medical officer and pediatric emergency medicines at District Headquarters Hospital Khuzdar evening shift.',
  'RESOLVED',
  'URGENT',
  'Director General Health Balochistan ordered surprise inspection; medical officer posted and essential drug supply replenished.',
  '2026-10-18 16:00:00',
  '2026-10-16 14:20:00'
);

insertHistory.run(
  'csh-5',
  'cmp-demo-2',
  null,
  'SUBMITTED',
  null,
  'Grievance submitted by citizen via helpline.',
  '2026-10-16 14:20:00'
);

insertHistory.run(
  'csh-6',
  'cmp-demo-2',
  'SUBMITTED',
  'ASSIGNED',
  'usr-grm-1',
  'Forwarded directly to DG Health Services for urgent administrative inquiry.',
  '2026-10-16 16:00:00'
);

insertHistory.run(
  'csh-7',
  'cmp-demo-2',
  'ASSIGNED',
  'RESOLVED',
  'usr-admin-1',
  'Duty doctors roster enforced and pediatric medicines batch delivered to hospital pharmacy. Complainant confirmed via phone verification.',
  '2026-10-18 16:00:00'
);

console.log('Seeding completed successfully!');
db.close();
