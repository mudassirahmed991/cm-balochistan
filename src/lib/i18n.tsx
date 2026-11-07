"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "ur";

export interface Translations {
  siteTitle: string;
  govTitle: string;
  officialPortal: string;
  provincialAssembly: string;
  search: string;
  searchPlaceholder: string;
  trackComplaint: string;
  registerComplaint: string;
  home: string;
  aboutCM: string;
  formerCMs: string;
  cabinet: string;
  history: string;
  priorities: string;
  news: string;
  complaintCell: string;
  contactUs: string;
  readFullMessage: string;
  explorePriorities: string;
  exploreInitiatives: string;
  latestNews: string;
  viewAllNews: string;
  complaintHelpline: string;
  complaintHours: string;
  officialAWAAZ: string;
  trackAWAAZ: string;
  learnMoreGuidelines: string;
  officeAddress: string;
  allRightsReserved: string;
  privacyPolicy: string;
  termsOfUse: string;
  accessibility: string;
  textSize: string;
  languageName: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    siteTitle: "Office of the Chief Minister",
    govTitle: "Government of Balochistan",
    officialPortal: "Official portal",
    provincialAssembly: "Provincial Assembly",
    search: "Search",
    searchPlaceholder: "Search priorities, news, services…",
    trackComplaint: "Track Complaint",
    registerComplaint: "Register Complaint",
    home: "Home",
    aboutCM: "About Chief Minister",
    formerCMs: "Former Chief Ministers",
    cabinet: "Cabinet Members",
    history: "Our History",
    priorities: "Priorities",
    news: "News & Updates",
    complaintCell: "Complaint Cell (GRM)",
    contactUs: "Contact Us",
    readFullMessage: "Read Full Message",
    explorePriorities: "Explore All Priorities",
    exploreInitiatives: "Explore All Initiatives",
    latestNews: "Latest News from the CM Office",
    viewAllNews: "View All News",
    complaintHelpline: "Official GRM Helpline: 1160",
    complaintHours: "24/7 Citizen Redressal Helpline",
    officialAWAAZ: "Register on Official GRM (AWAAZ)",
    trackAWAAZ: "Track on Official GRM",
    learnMoreGuidelines: "Learn More & Escalation Policy",
    officeAddress: "Chief Minister House, Zarghoon Road, Quetta, Balochistan",
    allRightsReserved: "All rights reserved. Government of Balochistan.",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    accessibility: "Accessibility Statement",
    textSize: "Text:",
    languageName: "English",
  },
  ur: {
    siteTitle: "دفتر وزیر اعلیٰ بلوچستان",
    govTitle: "حکومت بلوچستان",
    officialPortal: "سرکاری پورٹل",
    provincialAssembly: "صوبائی اسمبلی",
    search: "تلاش کریں",
    searchPlaceholder: "ترجیحات، خبریں، خدمات تلاش کریں…",
    trackComplaint: "شکایت ٹریک کریں",
    registerComplaint: "شکایت درج کریں",
    home: "صفحہ اول",
    aboutCM: "وزیر اعلیٰ کے بارے میں",
    formerCMs: "سابق وزرائے اعلیٰ",
    cabinet: "کابینہ اراکین",
    history: "ہماری تاریخ",
    priorities: "حکومتی ترجیحات",
    news: "خبریں اور اعلانات",
    complaintCell: "شکایات سیل (جی آر ایم)",
    contactUs: "رابطہ کریں",
    readFullMessage: "مکمل پیغام پڑھیں",
    explorePriorities: "تمام ترجیحات دیکھیں",
    exploreInitiatives: "تمام حکومتی منصوبے",
    latestNews: "وزیر اعلیٰ آفس کی تازہ ترین خبریں",
    viewAllNews: "تمام خبریں دیکھیں",
    complaintHelpline: "سرکاری شکایات ہیلپ لائن: 1160",
    complaintHours: "24 گھنٹے عوامی شکایات سیل",
    officialAWAAZ: "سرکاری پورٹل (آواز) پر شکایت درج کریں",
    trackAWAAZ: "سرکاری پورٹل پر ٹریک کریں",
    learnMoreGuidelines: "رہنما اصول اور اپیل کا طریقہ",
    officeAddress: "وزیر اعلیٰ ہاؤس، زرغون روڈ، کوئٹہ، بلوچستان",
    allRightsReserved: "جملہ حقوق محفوظ ہیں۔ حکومت بلوچستان۔",
    privacyPolicy: "رازداری کی پالیسی",
    termsOfUse: "شرائط و ضوابط",
    accessibility: "رسائی کی سہولیات",
    textSize: "حجم:",
    languageName: "اردو",
  },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Translations) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => translations.en[key] || String(key),
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cm_locale") as Locale | null;
        if (saved === "ur" || saved === "en") return saved;
      } catch {
        // localStorage may fail
      }
    }
    return "en";
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr";
    if (locale === "ur") {
      document.documentElement.classList.add("urdu-mode");
    } else {
      document.documentElement.classList.remove("urdu-mode");
    }
  }, [locale]);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("cm_locale", newLocale);
      document.cookie = `cm_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore
    }
  }

  const t = (key: keyof Translations): string => {
    return translations[locale][key] || translations.en[key] || String(key);
  };

  const dir = locale === "ur" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
