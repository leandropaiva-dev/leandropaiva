"use client";
import React, { useState } from 'react';
import Silk from '../../components/Silk';
import { Menu, MenuItem, HoveredLink } from '../../components/ui/navbar-menu';
import { LanguageSwitcher } from '../../components/ui/language-switcher';
import { getTranslations, type Locale } from '../../lib/translations';
import { useParams } from 'next/navigation';

export default function Home() {
  const [active, setActive] = useState<string | null>(null);
  const params = useParams();
  const locale = (params.locale as Locale) || 'pt';
  const translations = getTranslations(locale);
  const t = translations.hero;
  const navT = translations.nav;

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Background Silk */}
      <Silk
        speed={20}
        scale={1.3}
        color="#5227FF"
        noiseIntensity={0}
        rotation={2}
      />

      {/* Navbar */}
      <div className="fixed top-10 inset-x-0 max-w-4xl mx-auto z-30">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item={navT.services}>
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev">{navT.webDev}</HoveredLink>
                <HoveredLink href="/mobile-dev">{navT.mobileDev}</HoveredLink>
                <HoveredLink href="/ui-design">{navT.uiDesign}</HoveredLink>
                <HoveredLink href="/consulting">{navT.consulting}</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item={navT.products}>
              <div className="text-sm grid grid-cols-2 gap-10 p-4">
                <div className="flex flex-col space-y-4">
                  <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
                    {navT.webProjects}
                  </h4>
                  <HoveredLink href="/ecommerce">{navT.ecommerce}</HoveredLink>
                  <HoveredLink href="/portfolios">{navT.portfolios}</HoveredLink>
                  <HoveredLink href="/landing-pages">{navT.landingPages}</HoveredLink>
                </div>
                <div className="flex flex-col space-y-4">
                  <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
                    {navT.mobileApps}
                  </h4>
                  <HoveredLink href="/ios-apps">{navT.iosApps}</HoveredLink>
                  <HoveredLink href="/android-apps">{navT.androidApps}</HoveredLink>
                  <HoveredLink href="/hybrid-apps">{navT.hybridApps}</HoveredLink>
                </div>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item={navT.about}>
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/about">{navT.ourStory}</HoveredLink>
                <HoveredLink href="/team">{navT.team}</HoveredLink>
                <HoveredLink href="/careers">{navT.careers}</HoveredLink>
                <HoveredLink href="/contact">{navT.contact}</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item={navT.contact}>
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/contact">{navT.contactUs}</HoveredLink>
                <HoveredLink href="/support">{navT.support}</HoveredLink>
                <HoveredLink href="/partnerships">{navT.partnerships}</HoveredLink>
              </div>
            </MenuItem>
          </Menu>
          <div className="flex-1 flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
        {/* Badge */}
        <div className="inline-block mb-8">
          <span className="px-4 py-2 text-xs font-medium tracking-widest uppercase border border-white/20 rounded-full bg-white/10 backdrop-blur-sm">
            {t.badge}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl text-white">
          {t.title}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl leading-relaxed">
          {t.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors cursor-pointer uppercase">
            {t.viewWork}
          </button>
          <button className="px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors cursor-pointer uppercase">
            {t.getInTouch}
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-medium tracking-widest uppercase text-white/60">
              {t.scroll}
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
