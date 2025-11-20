"use client";
import React, { useState } from 'react';
import { motion } from "motion/react";
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (language: Language) => {
    setIsOpen(false);

    // Get the path without the current locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // Navigate to the new locale
    router.push(`/${language.code}${pathWithoutLocale}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute top-full mt-2 right-0 bg-white dark:bg-black backdrop-blur-sm rounded-xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl min-w-[160px] z-50"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                currentLang.code === language.code ? 'bg-gray-50 dark:bg-gray-900' : ''
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium text-black dark:text-white">{language.name}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};