/**
 * Government of Balochistan — Official AI Knowledge Base
 * Verified Data for Chief Minister of Balochistan and Balochistan Province
 */

export interface KnowledgeItem {
  id: string;
  category: "cm" | "initiatives" | "balochistan" | "tourism" | "services" | "districts";
  title: string;
  keywords: string[];
  contentEn: string;
  contentUr: string;
  sourceTitle: string;
  sourceUrl: string;
}

export const governmentKnowledgeBase: KnowledgeItem[] = [
  // --- CHIEF MINISTER ---
  {
    id: "cm-profile",
    category: "cm",
    title: "Chief Minister Mir Sarfraz Bugti — Profile & Biography",
    keywords: ["chief minister", "sarfraz bugti", "mir sarfraz bugti", "cm", "profile", "biography", "who is cm", "وزیر اعلیٰ", "سرفراز بگٹی"],
    contentEn:
      "Mir Sarfraz Bugti assumed office as the Chief Minister of Balochistan on 2 March 2024 following his election by the Provincial Assembly of Balochistan. Born in Dera Bugti, he is a prominent political leader affiliated with the Pakistan Peoples Party (PPP). He previously served as Federal Minister for Interior and as Balochistan Provincial Home Minister. His tenure focuses on good governance, institutional reform, youth empowerment, quality education, healthcare access, and inclusive socio-economic development across all districts.",
    contentUr:
      "میر سرفراز بگٹی نے 2 مارچ 2024 کو صوبائی اسمبلی بلوچستان سے منتخب ہو کر وزیر اعلیٰ بلوچستان کے عہدے کا حلف اٹھایا۔ ان کا تعلق پاکستان پیپلز پارٹی سے ہے۔ اس سے قبل وہ وفاقی وزیر داخلہ اور صوبائی وزیر داخلہ بلوچستان کے فرائض انجام دے چکے ہیں۔ ان کی حکومت کی ترجیحات میں گڈ گورننس، نوجوانوں کے لیے روزگار، تعلیم و صحت کا فروغ اور تمام اضلاع کی مساوی ترقی شامل ہے۔",
    sourceTitle: "CM Balochistan Official Profile",
    sourceUrl: "https://cm.balochistan.gob.pk/chief-minister",
  },
  {
    id: "cm-vision-quote",
    category: "cm",
    title: "Chief Minister's Vision & Official Statement",
    keywords: ["vision", "statement", "message", "quote", "mission", "پیغام", "وژن"],
    contentEn:
      "Official Quote: 'Balochistan’s greatest resource is its people. Our task is to turn distance into opportunity — and promise into progress.' Chief Minister Mir Sarfraz Bugti emphasizes transparent, citizen-centric governance, grievance resolution within 24 hours, strict merit-based recruitments, and bridging the infrastructure gap between remote districts and urban centers.",
    contentUr:
      "وزیر اعلیٰ میر سرفراز بگٹی کا باضابطہ پیغام: 'بلوچستان کا سب سے قیمتی اثاثہ اس کے باصلاحیت عوام ہیں۔ ہمارا مشن فاصلوں کو مواقع اور وعدوں کو عملی ترقی میں تبدیل کرنا ہے۔' حکومت شفاف طرز حکمرانی، میرٹ اور عوامی شکایات کے بروقت ازالے پر کاربند ہے۔",
    sourceTitle: "CM Secretariat Statement",
    sourceUrl: "https://cm.balochistan.gob.pk",
  },
  {
    id: "cm-initiatives",
    category: "initiatives",
    title: "Key Government Initiatives & Development Policies",
    keywords: ["initiatives", "projects", "education emergency", "youth skills", "policies", "development", "منصوبے", "اقدامات"],
    contentEn:
      "Major provincial initiatives under CM Mir Sarfraz Bugti include:\n1. CM Education Emergency: Revitalizing non-functional schools, biometric teacher attendance, and the Shaheed Benazir Bhutto Scholarship Program for higher education.\n2. CM Youth Skills & IT Program: Technical training and digital freelancing centers across Quetta, Makran, and Kalat.\n3. Healthcare Uplift: Mobile health units in remote rural areas and upgrading District Headquarters (DHQ) hospitals with cardiac and emergency units.\n4. Green Balochistan: Solarization of agricultural tube-wells and climate-resilient water storage dams.\n5. Quetta Beautification & Traffic Masterplan: Expanding ring roads and modern drainage systems.",
    contentUr:
      "حکومت بلوچستان کے اہم جاری منصوبے:\n1. تعلیمی ایمرجنسی اور بے نظیر بھٹو اسکالرشپ پروگرام\n2. یوتھ اسکلز و ڈیجیٹل ٹریننگ سینٹرز کا قیام\n3. دور دراز علاقوں کے لیے موبائل ہیلتھ یونٹس اور ضلعی اسپتالوں کی اپ گریڈیشن\n4. گرین بلوچستان کے تحت زرعی ٹیوب ویلوں کی سولرائزیشن اور ڈیمز کی تعمیر\n5. کوئٹہ ڈیولپمنٹ پیکج اور ٹریفک انفراسٹرکچر کی بحالی۔",
    sourceTitle: "Government Priorities & Initiatives",
    sourceUrl: "https://cm.balochistan.gob.pk/priorities",
  },
  {
    id: "grm-complaints",
    category: "services",
    title: "Public Grievance Redressal (AWAAZ / GRM Balochistan)",
    keywords: ["complaint", "track complaint", "grm", "awaaz", "helpline", "grievance", "contact cm", "شکایت", "ہیلپ لائن"],
    contentEn:
      "Citizens can submit official complaints directly to the Chief Minister Grievance Redressal Mechanism (AWAAZ):\n- Official Portal: https://grmbalochistan.com\n- 24/7 Citizen Helpline: 081-9202424\n- CM Secretariat Address: Chief Minister House, Zarghoon Road, Quetta\n- Official Email: info@cm.balochistan.gob.pk\nComplaints receive a unique tracking ID and are monitored until resolution by provincial administrative secretaries.",
    contentUr:
      "عوام الناس وزیر اعلیٰ شکایات سیل (آواز - AWAAZ) کے ذریعے اپنی شکایات درج کروا سکتے ہیں:\n- آن لائن پورٹل: https://grmbalochistan.com\n- 24/7 ہیلپ لائن: 081-9202424\n- پتہ: چیف منسٹر ہاؤس، زرغون روڈ، کوئٹہ\n- ای میل: info@cm.balochistan.gob.pk",
    sourceTitle: "CM Grievance Redressal Portal",
    sourceUrl: "https://grmbalochistan.com",
  },

  // --- BALOCHISTAN PROVINCE ---
  {
    id: "balochistan-geography-history",
    category: "balochistan",
    title: "Balochistan History, Geography & Location",
    keywords: ["geography", "history", "area", "borders", "capital", "location", "جغرافیہ", "تاریخ", "رقبہ"],
    contentEn:
      "Balochistan is Pakistan's largest province by land area, encompassing approximately 347,190 square kilometers (about 44% of Pakistan's total land area). The provincial capital is Quetta. Geographically, it shares borders with Iran to the west, Afghanistan to the north, Khyber Pakhtunkhwa to the northeast, Punjab to the east, Sindh to the southeast, and the Arabian Sea to the south with a strategic 770-kilometer coastline.",
    contentUr:
      "بلوچستان رقبے کے لحاظ سے پاکستان کا سب سے بڑا صوبہ ہے جس کا رقبہ تقریباً 347,190 مربع کلومیٹر ہے جو ملک کے کل رقبے کا لگ بھگ 44 فیصد ہے۔ صوبائی دارالحکومت کوئٹہ ہے۔ بلوچستان مغرب میں ایران، شمال میں افغانستان، مشرق میں سندھ و پنجاب اور جنوب میں بحیرہ عرب کے ساتھ 770 کلومیٹر طویل ساحلی پٹی پر واقع ہے۔",
    sourceTitle: "Official Portal of Government of Balochistan",
    sourceUrl: "https://balochistan.gov.pk",
  },
  {
    id: "balochistan-divisions-districts",
    category: "districts",
    title: "Administrative Divisions and Districts of Balochistan",
    keywords: ["divisions", "districts", "quetta", "kalat", "makran", "zhob", "sibi", "loralai", "rakhshan", "nasirabad", "اضلاع", "ڈویژن"],
    contentEn:
      "Balochistan is divided into 8 administrative divisions and 36 districts:\n1. Quetta Division (Quetta, Pishin, Killa Abdullah, Chaman)\n2. Kalat Division (Kalat, Khuzdar, Mastung, Awaran, Surab, Lasbela, Hub)\n3. Makran Division (Gwadar, Kech / Turbat, Panjgur)\n4. Nasirabad Division (Nasirabad, Jaffarabad, Jhal Magsi, Dera Bugti, Kacchi, Usta Muhammad)\n5. Sibi Division (Sibi, Kohlu, Ziarat, Harnai)\n6. Zhob Division (Zhob, Killa Saifullah, Sherani)\n7. Loralai Division (Loralai, Musakhail, Barkhan, Duki)\n8. Rakhshan Division (Chagai, Kharan, Nushki, Washuk).",
    contentUr:
      "بلوچستان انتظامی طور پر 8 ڈویژنز اور 36 اضلاع پر مشتمل ہے جن میں کوئٹہ، قلات، مکران، نصیر آباد، سبی، ژوب، لورالائی اور رخشاں ڈویژنز شامل ہیں۔",
    sourceTitle: "Balochistan Board of Revenue & LG",
    sourceUrl: "https://balochistan.gov.pk",
  },
  {
    id: "balochistan-culture",
    category: "balochistan",
    title: "Culture, Languages & Traditions of Balochistan",
    keywords: ["culture", "languages", "traditions", "balochi", "pashto", "brahui", "embroidery", "ثقافت", "زبانیں"],
    contentEn:
      "Balochistan has a rich, multi-ethnic cultural tapestry characterized by traditional hospitality, honor, and resilient community bonds. The primary languages spoken are Balochi, Pashto, Brahui, Sindhi, and Hazaragi, along with Urdu as the national language. The province is world-renowned for its exquisite hand-woven carpets, intricate Balochi and Pashtun needlework embroidery, traditional Sajji cuisine, and folk music with instruments like the Suroz and Tamboorag.",
    contentUr:
      "بلوچستان ثقافتی اور لسانی تنوع کا گہوارہ ہے جہاں بلوچی، پشتو، براہوی، ہزارگی اور سندھی زبانیں بولی جاتی ہیں۔ بلوچستان کی روایتی مہمان نوازی، ہاتھ سے بنے دیدہ زیب قالین، روایتی کڑھائی (دستکاری) اور سجی دنیا بھر میں مشہور ہیں۔",
    sourceTitle: "Culture, Tourism & Archives Department",
    sourceUrl: "https://balochistan.gov.pk",
  },
  {
    id: "balochistan-tourism",
    category: "tourism",
    title: "Important Places & Tourism in Balochistan",
    keywords: ["tourism", "places", "ziarat", "gwadar", "hingol", "kund malir", "astola", "quaid residency", "سیاحت", "مقامات", "زیارت", "گوادر"],
    contentEn:
      "Top tourist and historical destinations in Balochistan include:\n1. Ziarat: Home to the world's second-largest ancient Juniper Forest and the historic Quaid-e-Azam Residency.\n2. Hingol National Park: Pakistan's largest national park featuring natural rock formations like the 'Princess of Hope' and mud volcanoes.\n3. Kund Malir & Coastal Highway: Spectacular golden beaches along the Makran Coastal Highway.\n4. Astola Island: Pakistan's largest offshore island near Pasni, famous for crystal-clear turquoise waters and marine biodiversity.\n5. Gwadar: Deep Sea Port, Hammerhead peninsula, and Marine Drive.\n6. Hanna Lake & Urak Valley: Scenic lakes and orchards near Quetta.\n7. Pir Ghaib & Moola Chotok: Majestic cascading desert waterfalls.",
    contentUr:
      "بلوچستان کے اہم ترین سیاحتی اور تاریخی مقامات:\n1. زیارت: دنیا کے قدیم ترین صنوبر (جونیپر) کے جنگلات اور تاریخی قائد اعظم ریزیڈنسی\n2. ہنگول نیشنل پارک: پرنسز آف ہوپ اور مڈ والکینو\n3. کنڈ ملیر اور مکران کوسٹل ہائی وے: شاندار قدرتی ساحل\n4. استولا جزیرہ: بحیرہ عرب میں واقع خوبصورت اور شفاف پانیوں کا جزیرہ\n5. گوادر پورٹ اور میرین ڈرائیو\n6. ہنہ جھیل و وادی اورک (کوئٹہ)\n7. پیر غائب اور مولا چٹوک آبشاریں۔",
    sourceTitle: "Balochistan Tourism Development Corporation",
    sourceUrl: "https://balochistan.gov.pk",
  },
  {
    id: "balochistan-economy-resources",
    category: "balochistan",
    title: "Economy, Resources, CPEC & Infrastructure",
    keywords: ["economy", "resources", "cpec", "gwadar port", "reko diq", "minerals", "saindak", "معیشت", "معدنیات", "ریکوڈک"],
    contentEn:
      "Balochistan is Pakistan's mineral powerhouse and maritime gateway:\n- Minerals: Home to world-class copper and gold reserves at Reko Diq and Saindak, high-grade chromite, marble, coal, and natural gas (Sui, Dera Bugti).\n- Ports & CPEC: Gwadar Deep Sea Port serves as the crown jewel of the China-Pakistan Economic Corridor (CPEC), connecting Central Asia, Western China, and the Middle East.\n- Agriculture & Fisheries: Produces 90% of Pakistan's grapes, cherries, and almonds, exceptional date varieties (Makran), and premium seafood exports from Gwadar, Pasni, and Ormara.",
    contentUr:
      "بلوچستان قدرتی وسائل اور معاشی لحاظ سے انتہائی اہم ہے:\n- ریکوڈک اور سیندک کے تاریخی تانبے اور سونے کے ذخائر، ماربل، کوئلہ اور قدرتی گیس۔\n- سی پیک اور گوادر ڈیپ سی پورٹ جو خطے میں بین الاقوامی تجارتی گیٹ وے کی حیثیت رکھتی ہے۔\n- زراعت میں انگور، بادام، سیب، مکران کی کھجوریں اور بحیرہ عرب سے سمندری خوراک (سی فوڈ) کی برآمدات۔",
    sourceTitle: "Department of Mines & Minerals Balochistan",
    sourceUrl: "https://balochistan.gov.pk",
  },
  {
    id: "balochistan-education-health",
    category: "balochistan",
    title: "Education, Universities & Healthcare Infrastructure",
    keywords: ["education", "universities", "buitems", "uob", "healthcare", "hospitals", "bmc", "تعلیم", "صحت", "اسپتال"],
    contentEn:
      "Major educational and healthcare institutions in Balochistan:\n- Higher Education: University of Balochistan (UoB), BUITEMS Quetta, Sardar Bahadur Khan Women's University (SBKWU), Balochistan University of Medical & Health Sciences (BUMHS), and Gwadar University.\n- Healthcare: Bolan Medical Complex Hospital, Sandeman Provincial Hospital Quetta, Sheikh Zayed Hospital, and district DHQ hospital networks, supplemented by the CM Rural Mobile Health Clinics.",
    contentUr:
      "صوبے کے اہم تعلیمی اور طبی ادارے:\n- جامعات: جامعہ بلوچستان، بیوٹمز (BUITEMS)، سردار بہادر خان ویمن یونیورسٹی، جامعہ گوادر۔\n- طبی مراکز: بولان میڈیکل کمپلیکس کوئٹہ، سنڈیمن پروونشل اسپتال، شیخ زید اسپتال اور تمام اضلاع میں ہیلتھ کلینکس۔",
    sourceTitle: "Health & Higher Education Departments",
    sourceUrl: "https://balochistan.gov.pk",
  },
];

/**
 * Intelligent Retrieval Engine: Matches user query against verified knowledge base
 */
export function queryGovernmentKnowledge(query: string, locale: "en" | "ur" = "en"): {
  answer: string;
  sourceTitle: string;
  sourceUrl: string;
  matchedTitle: string;
} | null {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;

  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of governmentKnowledgeBase) {
    let score = 0;

    for (const kw of item.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    const titleWords = item.title.toLowerCase().split(/\s+/);
    for (const tw of titleWords) {
      if (tw.length > 3 && normalized.includes(tw)) {
        score += 1.5;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // Threshold score
  if (!bestMatch || highestScore < 1.5) {
    return null;
  }

  const isUrduQuery = /[\u0600-\u06FF]/.test(query);
  const useUrdu = locale === "ur" || isUrduQuery;

  return {
    answer: useUrdu ? bestMatch.contentUr : bestMatch.contentEn,
    sourceTitle: bestMatch.sourceTitle,
    sourceUrl: bestMatch.sourceUrl,
    matchedTitle: bestMatch.title,
  };
}
