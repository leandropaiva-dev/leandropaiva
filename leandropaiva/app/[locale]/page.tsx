"use client";
import React, { useState, useRef, forwardRef, useEffect } from 'react';
import Squares from '../../components/Squares';
import { LanguageSwitcher } from '../../components/ui/language-switcher';
import { getTranslations, type Locale } from '../../lib/translations';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatedBeam } from '../../components/ui/animated-beam';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel';
import BlogCard from '../../components/BlogCard';
import ScrollFloat from '../../components/ScrollFloat';
import CountUp from '../../components/CountUp';

gsap.registerPlugin(ScrollTrigger);

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-16 items-center justify-center rounded-full border-2 border-white/20 bg-white p-3 shadow-[0_0_20px_-12px_rgba(255,255,255,0.3)]",
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

function HorizontalScrollSection({ workT, navT }: { workT: any; navT: any }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [api, setApi] = useState<any>()

  const projectTags = [
    ["Next.js 14", "TypeScript", "Tailwind CSS", "Supabase", "Stripe"],
    ["React", "Tailwind", "WordPress", "REST API"],
    ["Next.js", "Framer Motion", "Tailwind"]
  ]

  const projects = workT.projects.map((project: any, index: number) => ({
    id: index + 1,
    title: project.title,
    description: project.description,
    role: project.role,
    timeline: project.timeline,
    year: project.year,
    tags: projectTags[index],
    links: {
      live: "#",
      code: "#"
    },
    viewLive: project.viewLive,
    viewCode: project.viewCode
  }))

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const section = sectionRef.current
    const trigger = triggerRef.current

    if (!section || !trigger) return

    const scrollWidth = section.scrollWidth - window.innerWidth

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: trigger,
      start: "top top",
      end: () => `+=${scrollWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: gsap.to(section, {
        x: -scrollWidth,
        ease: "none",
      })
    })

    return () => {
      scrollTriggerInstance.kill()
    }
  }, [isMobile])

  // Autoplay para mobile - DISABLED to prevent hydration issues
  // useEffect(() => {
  //   if (!api || !isMobile) return

  //   const interval = setInterval(() => {
  //     api.scrollNext()
  //   }, 3000)

  //   return () => clearInterval(interval)
  // }, [api, isMobile])

  // Atualizar slide atual
  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap())
    })
  }, [api])

  // Mobile Carousel
  if (isMobile) {
    return (
      <div className="relative bg-black py-12 px-4">
        <Carousel
          className="w-full max-w-sm mx-auto"
          setApi={setApi}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {projects.map((project: any) => (
              <CarouselItem key={project.id} className="pl-4">
                <div className="flex flex-col space-y-6 py-8 h-full">
                  {/* Image/Preview */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs text-center px-4">
                      {project.title} Preview<br />
                      Video/GIF on Hover
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col space-y-4 h-full">
                    <h3 className="text-3xl font-bold text-white">
                      {project.title}
                    </h3>

                    <p className="text-sm text-white/60 leading-snug line-clamp-5">
                      {project.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 uppercase tracking-wider min-w-[80px]">{workT.metadata.role}</span>
                        <span className="text-white/80">{project.role}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 uppercase tracking-wider min-w-[80px]">{workT.metadata.timeline}</span>
                        <span className="text-white/80">{project.timeline}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 uppercase tracking-wider min-w-[80px]">{workT.metadata.year}</span>
                        <span className="text-white/80">{project.year}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3 pt-3">
                      <a href={project.links.live} className="px-5 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors text-center text-sm">
                        {project.viewLive}
                      </a>
                      <a href={project.links.code} className="px-5 py-2.5 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors text-center text-sm">
                        {project.viewCode}
                      </a>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Bullets */}
          <div className="flex justify-center gap-2 mt-8">
            {projects.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    )
  }

  // Desktop Horizontal Scroll
  return (
    <div ref={triggerRef} className="relative bg-black">
      <div className="min-h-screen sticky top-0 overflow-hidden flex items-center">
        <div ref={sectionRef} className="flex items-center">
          {projects.map((project: any) => (
            <div
              key={project.id}
              className="flex-shrink-0 w-screen flex items-center justify-center px-4 lg:px-8 py-16"
            >
              <div className="w-full lg:w-10/12 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-center">
                {/* Left Side - Info */}
                <div className="flex flex-col justify-center space-y-6 lg:space-y-8">
                  <h3 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm lg:text-base text-white/60 leading-snug line-clamp-5">
                    {project.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-3 text-sm lg:text-base">
                    <div className="flex items-center gap-4">
                      <span className="text-white/40 uppercase tracking-wider min-w-[100px] lg:min-w-[120px]">{workT.metadata.role}</span>
                      <span className="text-white/80">{project.role}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/40 uppercase tracking-wider min-w-[100px] lg:min-w-[120px]">{workT.metadata.timeline}</span>
                      <span className="text-white/80">{project.timeline}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/40 uppercase tracking-wider min-w-[100px] lg:min-w-[120px]">{workT.metadata.year}</span>
                      <span className="text-white/80">{project.year}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm rounded-full bg-white/5 border border-white/10 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-4 pt-4">
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="px-6 lg:px-8 py-3 lg:py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors text-center text-sm lg:text-base">
                      {project.viewLive}
                    </a>
                    <a href="#contact" className="px-6 lg:px-8 py-3 lg:py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors text-center text-sm lg:text-base">
                      {navT.contact}
                    </a>
                  </div>
                </div>

                {/* Right Side - Image/Preview */}
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-600/20 to-blue-600/20 hover:border-white/20 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm text-center px-4">
                      {project.title} Preview<br />
                      Video/GIF on Hover
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TechStackBeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Refs para as tecnologias
  const reactRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)
  const tsRef = useRef<HTMLDivElement>(null)
  const jsRef = useRef<HTMLDivElement>(null)
  const htmlRef = useRef<HTMLDivElement>(null)
  const cssRef = useRef<HTMLDivElement>(null)
  const tailwindRef = useRef<HTMLDivElement>(null)
  const wordpressRef = useRef<HTMLDivElement>(null)
  const supabaseRef = useRef<HTMLDivElement>(null)
  const gitRef = useRef<HTMLDivElement>(null)
  const githubRef = useRef<HTMLDivElement>(null)
  const vercelRef = useRef<HTMLDivElement>(null)

  const technologies = [
    { ref: reactRef, name: 'React', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 101 100" className="w-full h-full"><path fill="#61DAFB" d="M50.307 58.816a8.816 8.816 0 1 0 0-17.632 8.816 8.816 0 0 0 0 17.632" /><path stroke="#61DAFB" strokeWidth="5" d="M50.307 68.063c26.126 0 47.306-8.087 47.306-18.063s-21.18-18.062-47.306-18.062C24.18 31.938 3 40.024 3 50s21.18 18.063 47.307 18.063Z" /><path stroke="#61DAFB" strokeWidth="5" d="M34.664 59.031C47.727 81.658 65.321 95.957 73.96 90.97c8.64-4.988 5.053-27.374-8.01-50C52.885 18.342 35.291 4.043 26.652 9.03s-5.052 27.374 8.011 50Z" /><path stroke="#61DAFB" strokeWidth="5" d="M34.664 40.969c-13.063 22.626-16.65 45.012-8.01 50 8.638 4.988 26.232-9.311 39.295-31.938s16.65-45.012 8.01-50c-8.638-4.988-26.232 9.311-39.295 31.938Z" /></svg> },
    { ref: nextRef, name: 'Next.js', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#000" d="M50 99.999c27.614 0 50-22.386 50-50s-22.386-50-50-50-50 22.386-50 50 22.386 50 50 50" /><path fill="url(#nextA)" d="M83.06 87.51 38.412 30H30v39.983h6.73V38.545L77.777 91.58a50 50 0 0 0 5.283-4.07" /><path fill="url(#nextB)" d="M70.556 29.999h-6.667v40h6.667z" /><defs><linearGradient id="nextA" x1="60.556" x2="80.278" y1="64.721" y2="89.166" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient><linearGradient id="nextB" x1="67.222" x2="67.111" y1="29.999" y2="59.374" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs></svg> },
    { ref: tsRef, name: 'TypeScript', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#017ACB" d="M0 0h100v100H0z" /><path fill="#fff" d="M48.016 37.031h4.797v8.282h-12.97v36.843l-.343.094c-.469.125-6.64.125-7.969-.016l-1.062-.093V45.312H17.5v-8.28l4.11-.048c2.25-.03 8.03-.03 12.843 0 4.813.032 10.906.047 13.563.047m36.61 41.219c-1.907 2.016-3.954 3.14-7.36 4.063-1.485.406-1.735.421-5.078.406-3.344-.016-3.61-.016-5.235-.438-4.203-1.078-7.594-3.187-9.906-6.172-.656-.843-1.734-2.593-1.734-2.812 0-.063.156-.203.359-.297s.625-.36.969-.562c.343-.204.968-.579 1.39-.797.422-.22 1.64-.938 2.703-1.579 1.063-.64 2.032-1.156 2.141-1.156.11 0 .313.219.469.485.937 1.578 3.125 3.593 4.672 4.28.953.407 3.062.86 4.078.86.937 0 2.656-.406 3.578-.828.984-.453 1.484-.906 2.078-1.812.406-.641.453-.813.438-2.032 0-1.125-.063-1.437-.375-1.953-.875-1.437-2.063-2.187-6.875-4.312-4.97-2.203-7.204-3.516-9.016-5.282-1.344-1.312-1.61-1.67-2.453-3.312-1.094-2.11-1.235-2.797-1.25-5.937-.016-2.204.031-2.922.265-3.672.329-1.125 1.391-3.297 1.875-3.844 1-1.172 1.36-1.531 2.063-2.11 2.125-1.75 5.438-2.906 8.61-3.015.359 0 1.546.062 2.656.14 3.187.266 5.359 1.047 7.453 2.72 1.578 1.25 3.968 4.187 3.734 4.577-.156.235-6.39 4.391-6.797 4.516-.25.078-.422-.016-.765-.422-2.125-2.547-2.985-3.094-5.047-3.219-1.469-.093-2.25.078-3.235.735-1.03.687-1.53 1.734-1.53 3.187.015 2.125.827 3.125 3.827 4.61 1.938.953 3.594 1.734 3.719 1.734.188 0 4.203 2 5.25 2.625 4.875 2.86 6.86 5.797 7.375 10.86.375 3.812-.703 7.296-3.047 9.765" /></svg> },
    { ref: jsRef, name: 'JavaScript', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#F7DF1E" d="M100 0H0v100h100z" /><path fill="#000" d="M67.175 78.125c2.014 3.29 4.634 5.707 9.27 5.707 3.893 0 6.38-1.946 6.38-4.635 0-3.222-2.555-4.364-6.84-6.238l-2.35-1.008c-6.781-2.89-11.286-6.508-11.286-14.159 0-7.047 5.37-12.413 13.762-12.413 5.975 0 10.27 2.08 13.365 7.524l-7.317 4.699c-1.612-2.89-3.35-4.027-6.048-4.027-2.752 0-4.497 1.746-4.497 4.027 0 2.819 1.746 3.96 5.778 5.706l2.35 1.006c7.983 3.424 12.491 6.915 12.491 14.762 0 8.46-6.646 13.096-15.571 13.096-8.727 0-14.365-4.16-17.124-9.61zm-33.196.815c1.477 2.619 2.82 4.833 6.048 4.833 3.087 0 5.035-1.208 5.035-5.905V45.916h9.397v32.08c0 9.73-5.705 14.158-14.032 14.158-7.524 0-11.881-3.894-14.097-8.583z" /></svg> },
    { ref: htmlRef, name: 'HTML', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#E44D26" d="M14.021 90.034 6 0h88.187l-8.022 89.985L50.02 100" /><path fill="#F16529" d="M50.093 92.344V7.39h36.048l-6.88 76.811" /><path fill="#EBEBEB" d="M22.383 18.4h27.71v11.036H34.488L35.51 40.74h14.584v11.01H25.397zm3.5 38.893h11.084l.778 8.823 12.348 3.306v11.521l-22.654-6.32" /><path fill="#fff" d="M77.706 18.4H50.044v11.036h26.64zm-2.018 22.34H50.044v11.035h13.612l-1.288 14.341-12.324 3.306v11.473l22.606-6.271" /></svg> },
    { ref: cssRef, name: 'CSS', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#264DE4" d="m94.175 0-8.033 89.99L50.034 100l-36.01-9.996L6 0z" /><path fill="#2965F1" d="m79.265 84.26 6.864-76.9H50.087v84.988z" /><path fill="#EBEBEB" d="m24.396 40.74.99 11.039h24.702V40.74zm25.692-22.342h-27.68l1.003 11.038h26.676zm-.001 62.495V69.408l-.048.013-12.294-3.32-.786-8.803H25.878l1.547 17.332 22.612 6.277z" /><path fill="#fff" d="m63.642 51.779-1.281 14.316-12.312 3.323v11.484l22.63-6.272.166-1.865 2.594-29.06.27-2.965L77.7 18.398H50.05v11.038h15.555L64.599 40.74H50.05v11.04z" /></svg> },
    { ref: tailwindRef, name: 'Tailwind', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#06B6D4" d="M50 20q-20 0-25 19.994 7.5-9.997 17.5-7.498c3.804.95 6.522 3.71 9.532 6.764 4.902 4.974 10.576 10.731 22.969 10.731q20 0 24.999-19.995-7.5 9.997-17.5 7.5c-3.803-.951-6.521-3.71-9.531-6.765C68.067 25.758 62.392 20 50 20M25 49.991q-20 0-25 19.995 7.5-9.998 17.5-7.498c3.803.952 6.522 3.71 9.532 6.763C31.933 74.225 37.608 79.984 50 79.984q20 0 25-19.995-7.5 9.997-17.5 7.498c-3.803-.95-6.522-3.71-9.532-6.763C43.066 55.75 37.393 49.991 25 49.991" /></svg> },
    { ref: wordpressRef, name: 'WordPress', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#00749A" d="M7.107 49.999c0 16.979 9.867 31.65 24.175 38.604L10.82 32.543a42.7 42.7 0 0 0-3.714 17.456m71.85-2.165c0-5.3-1.904-8.972-3.538-11.83-2.174-3.533-4.211-6.525-4.211-10.058 0-3.943 2.99-7.613 7.202-7.613.19 0 .37.024.556.034C71.333 11.376 61.166 7.107 50 7.107c-14.985 0-28.17 7.689-35.839 19.334 1.007.03 1.956.05 2.76.05 4.487 0 11.432-.544 11.432-.544 2.312-.136 2.585 3.26.276 3.533 0 0-2.325.273-4.91.409l15.62 46.46 9.387-28.152-6.683-18.309c-2.31-.135-4.498-.409-4.498-.409-2.312-.135-2.04-3.67.27-3.533 0 0 7.084.544 11.299.544 4.486 0 11.431-.544 11.431-.544 2.314-.136 2.586 3.26.275 3.533 0 0-2.328.274-4.909.41l15.5 46.108L75.69 61.7c1.856-5.933 3.267-10.194 3.267-13.866" /><path fill="#00749A" d="m50.753 53.75-12.87 37.396a42.9 42.9 0 0 0 12.118 1.748 42.9 42.9 0 0 0 14.243-2.43 3.6 3.6 0 0 1-.305-.592zm36.885-24.33c.184 1.366.288 2.834.288 4.41 0 4.353-.812 9.246-3.261 15.364L71.563 87.075C84.315 79.64 92.893 65.824 92.893 50a42.66 42.66 0 0 0-5.255-20.58" /><path fill="#00749A" d="M50 0C22.43 0 0 22.43 0 49.999 0 77.57 22.43 100 50 100s50.003-22.429 50.003-50.002C100.003 22.429 77.569 0 50.001 0m0 97.708c-26.305 0-47.707-21.402-47.707-47.71C2.293 23.695 23.694 2.294 50 2.294c26.304 0 47.705 21.401 47.705 47.706 0 26.307-21.402 47.71-47.705 47.71" /></svg> },
    { ref: supabaseRef, name: 'Supabase', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="url(#supaA)" d="M57.894 98.338c-2.554 3.217-7.734 1.454-7.796-2.654l-.9-60.082h40.4c7.316 0 11.397 8.452 6.847 14.183z" /><path fill="url(#supaB)" fillOpacity=".2" d="M57.894 98.338c-2.554 3.217-7.734 1.454-7.796-2.654l-.9-60.082h40.4c7.316 0 11.397 8.452 6.847 14.183z" /><path fill="#3ECF8E" d="M41.464 1.66c2.555-3.217 7.735-1.454 7.796 2.654l.395 60.082H9.76c-7.318 0-11.399-8.452-6.848-14.182z" /><defs><linearGradient id="supaA" x1="49.198" x2="85.103" y1="48.924" y2="63.983" gradientUnits="userSpaceOnUse"><stop stopColor="#249361" /><stop offset="1" stopColor="#3ECF8E" /></linearGradient><linearGradient id="supaB" x1="33.279" x2="49.654" y1="27.129" y2="57.953" gradientUnits="userSpaceOnUse"><stop /><stop offset="1" stopOpacity="0" /></linearGradient></defs></svg> },
    { ref: gitRef, name: 'Git', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#DE4C36" d="M98.114 45.544 54.454 1.886a6.44 6.44 0 0 0-9.108 0l-9.066 9.066 11.5 11.501a7.65 7.65 0 0 1 7.869 1.834 7.66 7.66 0 0 1 1.817 7.916L68.55 43.287c2.682-.923 5.776-.326 7.918 1.82a7.66 7.66 0 0 1 0 10.836 7.662 7.662 0 0 1-12.508-8.335L53.623 37.271v27.202a7.663 7.663 0 0 1 2.026 12.288 7.66 7.66 0 0 1-10.836 0 7.663 7.663 0 0 1 2.508-12.51V36.795a7.6 7.6 0 0 1-2.508-1.672 7.66 7.66 0 0 1-1.651-8.377l-11.338-11.34L1.887 45.344a6.44 6.44 0 0 0 0 9.11l43.661 43.659a6.44 6.44 0 0 0 9.108 0l43.458-43.457a6.444 6.444 0 0 0 0-9.11" /></svg> },
    { ref: githubRef, name: 'GitHub', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#161614" d="M50 1C22.39 1 0 23.386 0 51c0 22.092 14.327 40.834 34.193 47.446 2.499.462 3.417-1.085 3.417-2.406 0-1.192-.047-5.131-.068-9.309-13.91 3.025-16.846-5.9-16.846-5.9-2.274-5.779-5.551-7.315-5.551-7.315-4.537-3.104.341-3.04.341-3.04 5.022.353 7.665 5.153 7.665 5.153 4.46 7.644 11.697 5.434 14.55 4.156.449-3.232 1.745-5.437 3.175-6.686-11.106-1.264-22.78-5.552-22.78-24.71 0-5.459 1.953-9.92 5.151-13.42-.519-1.26-2.23-6.346.485-13.233 0 0 4.198-1.344 13.753 5.125 3.988-1.108 8.266-1.663 12.515-1.682 4.25.019 8.53.574 12.526 1.682 9.544-6.469 13.736-5.125 13.736-5.125 2.722 6.887 1.01 11.973.49 13.232 3.206 3.502 5.146 7.962 5.146 13.42 0 19.205-11.697 23.434-22.83 24.671 1.793 1.552 3.391 4.595 3.391 9.26 0 6.69-.058 12.074-.058 13.721 0 1.33.9 2.89 3.435 2.399C85.692 91.819 100 73.085 100 51c0-27.614-22.386-50-50-50" /><path fill="#161614" d="M18.727 72.227c-.11.248-.502.322-.857.152-.363-.163-.567-.502-.45-.751.109-.256.5-.327.862-.156.363.163.57.505.445.755m2.46 2.194c-.24.221-.706.118-1.022-.231-.327-.349-.388-.814-.146-1.04.246-.22.698-.117 1.026.232.327.353.39.816.14 1.04zm1.687 2.808c-.307.213-.808.013-1.118-.432-.306-.444-.306-.977.007-1.191.31-.214.804-.021 1.118.42.305.452.305.985-.008 1.203m2.853 3.252c-.274.302-.858.22-1.285-.192-.437-.403-.56-.975-.284-1.277.277-.303.864-.218 1.295.191.434.403.566.979.274 1.278m3.688 1.098c-.12.391-.683.57-1.25.403-.565-.171-.935-.63-.821-1.026.118-.394.682-.58 1.253-.401.565.17.936.625.818 1.024m4.197.465c.014.413-.466.755-1.06.762-.599.013-1.082-.32-1.088-.726 0-.416.469-.755 1.067-.765.594-.012 1.081.32 1.081.73m4.123-.158c.071.403-.342.816-.932.926-.58.106-1.118-.143-1.192-.541-.072-.413.35-.826.928-.933.592-.103 1.12.14 1.196.548" /></svg> },
    { ref: vercelRef, name: 'Vercel', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#000" fillRule="evenodd" d="M100 93.957 50 7 0 93.957z" clipRule="evenodd" /></svg> },
  ]

  if (!isMounted) {
    return (
      <div className="relative flex w-full items-center justify-center overflow-hidden py-16 md:py-24">
        <div className="relative w-full max-w-lg md:max-w-4xl aspect-square md:aspect-[2/1]" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center overflow-hidden py-16 md:py-24"
    >
      <div className="relative w-full max-w-lg md:max-w-4xl aspect-square md:aspect-[2/1]">
        {/* Center - Your Photo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Circle ref={centerRef} className="size-24 md:size-28 lg:size-36 border-4 border-purple-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white/40 text-xs">
              Foto
            </div>
          </Circle>
        </div>

        {/* Technologies in Circle (mobile) or Ellipse (desktop) */}
        {technologies.map((tech, index) => {
          const angle = (index * 360) / technologies.length - 90 // Start from top
          const radiusX = 40 // horizontal radius percentage
          const radiusY = isMounted && window.innerWidth < 768 ? 40 : 35 // Circle on mobile, ellipse on desktop
          const x = 50 + radiusX * Math.cos((angle * Math.PI) / 180)
          const y = 50 + radiusY * Math.sin((angle * Math.PI) / 180)

          return (
            <div
              key={tech.name}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Circle ref={tech.ref} className="size-14 md:size-16 lg:size-20">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">{tech.icon}</div>
              </Circle>
            </div>
          )
        })}
      </div>

      {/* Animated Beams connecting all techs to center */}
      {technologies.map((tech, index) => (
        <AnimatedBeam
          key={tech.name}
          containerRef={containerRef}
          fromRef={tech.ref}
          toRef={centerRef}
          duration={2}
          delay={index * 0.1}
          curvature={0}
          reverse={index % 2 === 0}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'pt';
  const translations = getTranslations(locale);
  const t = translations.hero;
  const aboutT = translations.about;
  const techStackT = translations.techStack;
  const workT = translations.work;
  const experienceT = translations.experience;
  const navT = translations.nav;
  const contactT = translations.contact;
  const blogT = translations.blog;
  const footerT = translations.footer;
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [blogApi, setBlogApi] = useState<any>();
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Fetch WordPress posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://public-api.wordpress.com/wp/v2/sites/leandropaivavercel.wordpress.com/posts?per_page=3');
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  // Autoplay blog carousel - DISABLED to prevent hydration issues
  // useEffect(() => {
  //   if (!blogApi || blogPosts.length === 0) return;

  //   const interval = setInterval(() => {
  //     blogApi.scrollNext();
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [blogApi, blogPosts]);

  // Scroll Reveal Animation
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-element');

    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom-=100',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger && (trigger.vars.trigger as HTMLElement).classList?.contains('reveal-element')) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Atualizar slide atual do blog
  useEffect(() => {
    if (!blogApi) return;

    blogApi.on('select', () => {
      setCurrentBlogSlide(blogApi.selectedScrollSnap());
    });
  }, [blogApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        {/* Background Squares */}
        <Squares
          speed={0.5}
          squareSize={40}
          direction='diagonal'
          borderColor='#333'
          hoverFillColor='#1a1a1a'
        />

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="w-full px-4 md:px-8">
            <div className="flex items-center justify-between h-12">
              {/* Logo/Brand - Left */}
              <div className="flex-shrink-0">
                <span className="text-white font-bold text-lg">LP</span>
              </div>

              {/* Menu Items - Center */}
              <div className="hidden md:flex items-center space-x-8">
                <a href={`/${locale}`} className="text-white/80 hover:text-white text-sm transition-colors">
                  {navT.home}
                </a>
                <a href="#about" className="text-white/80 hover:text-white text-sm transition-colors">
                  {navT.about}
                </a>
                <a href="#work" className="text-white/80 hover:text-white text-sm transition-colors">
                  {navT.projects}
                </a>
                <a href="#experience" className="text-white/80 hover:text-white text-sm transition-colors">
                  {navT.experience}
                </a>
                <a href="#blog" className="text-white/80 hover:text-white text-sm transition-colors">
                  {navT.blog}
                </a>
                <a href="#contact" className="text-white/80 hover:text-white text-sm transition-colors">
                  {navT.contact}
                </a>
              </div>

              {/* Language Switcher - Right */}
              <div className="flex-shrink-0">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </nav>

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

      {/* About Section - Bento Grid */}
      <section id="about" className="w-full bg-black py-16 md:py-24 px-4 md:px-8">
        <div className="w-full md:w-10/12 mx-auto">
          {/* Title */}
          <div className="reveal-element mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {aboutT.title}
            </h2>
          </div>

          {/* Bento Grid Layout */}
          <div className="flex flex-col gap-4 md:gap-6 lg:grid lg:grid-cols-12">
            {/* Photo Card - Larger square */}
            <div className="reveal-element lg:col-span-5 lg:row-span-2">
              <div className="relative aspect-square group bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300">
                {/* Decorative border frame */}
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>

                {/* Image container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src="/leandro1.jpg"
                    alt="Leandro Paiva"
                    className="w-full h-full object-cover"
                  />
                  {/* Strong gradient overlay - only bottom portion */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>

                  {/* Name overlay */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Leandro Paiva</h3>
                    <p className="text-base md:text-lg text-purple-400 font-medium">Front-End Developer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Me Card */}
            <div className="reveal-element lg:col-span-7 flex items-start">
              <div className="w-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 h-full">
                <h3 className="text-lg font-bold text-white mb-4">Sobre Mim</h3>
                <div className="space-y-3 text-sm text-white/70 leading-relaxed max-w-full">
                  <p className="break-words">
                    Tenho 25 anos e sou desenvolvedor front-end brasileiro vivendo em Portugal há 3 anos. Minha jornada na tecnologia começou com curiosidade e evoluiu para uma paixão genuína por criar experiências digitais excepcionais.
                  </p>
                  <p className="break-words">
                    Especializo-me em desenvolvimento moderno com Next.js, TypeScript e Tailwind CSS, sempre buscando as melhores práticas do ecossistema React. Meu objetivo é construir uma carreira sólida, contribuindo para projetos que combinem inovação tecnológica com impacto real.
                  </p>
                </div>
              </div>
            </div>

            {/* Career Journey Card - Horizontal Timeline */}
            <div className="reveal-element lg:col-span-7 flex items-end">
              <div className="w-full bg-white/[0.02] border border-white/10 rounded-3xl p-4 md:p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300">
                <h3 className="text-sm font-bold text-white mb-3">Trajetória Profissional</h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <p className="text-[10px] text-purple-400 font-medium text-center">NOS</p>
                    <p className="text-[8px] text-white/50 text-center mb-1">2021</p>
                    <p className="text-[9px] text-white/70 text-center leading-tight">Apoio Técnico</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <p className="text-[10px] text-blue-400 font-medium text-center">Crunch</p>
                    <p className="text-[8px] text-white/50 text-center mb-1">2022</p>
                    <p className="text-[9px] text-white/70 text-center leading-tight">CS Linha 1</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <p className="text-[10px] text-blue-400 font-medium text-center">Crunch</p>
                    <p className="text-[8px] text-white/50 text-center mb-1">2023</p>
                    <p className="text-[9px] text-white/70 text-center leading-tight">Analista Linha 2 B2B</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <p className="text-[10px] text-purple-400 font-bold text-center">Crunch</p>
                    <p className="text-[8px] text-white/50 text-center mb-1">Atual</p>
                    <p className="text-[9px] text-white/70 text-center leading-tight">Web & Data Specialist</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats and Stack Row - Mobile: separate cards, Desktop: grid */}
            <div className="reveal-element lg:col-span-12 grid grid-cols-3 lg:grid-cols-12 gap-4">
              {/* Stat 1 */}
              <div className="lg:col-span-2">
                <div className="aspect-square bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-3xl p-4 hover:border-purple-500/40 transition-all duration-300 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <CountUp end={20} suffix="+" />
                  </div>
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">Projetos</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="lg:col-span-2">
                <div className="aspect-square bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl p-4 hover:border-blue-500/40 transition-all duration-300 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <CountUp end={3} suffix="+" />
                  </div>
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">Anos</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="lg:col-span-2">
                <div className="aspect-square bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-3xl p-4 hover:border-purple-500/40 transition-all duration-300 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <CountUp end={100} suffix="%" />
                  </div>
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">Dedicação</div>
                </div>
              </div>

              {/* Tech Stack Card */}
              <div className="col-span-3 lg:col-span-6">
                <div className="h-full bg-white/[0.02] border border-white/10 rounded-3xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 flex flex-col justify-center">
                <h3 className="text-sm font-bold text-white mb-3">Stack Preferida</h3>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 lg:w-12 lg:h-12">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#000" d="M50 99.999c27.614 0 50-22.386 50-50s-22.386-50-50-50-50 22.386-50 50 22.386 50 50 50" /><path fill="url(#nextA)" d="M83.06 87.51 38.412 30H30v39.983h6.73V38.545L77.777 91.58a50 50 0 0 0 5.283-4.07" /><path fill="url(#nextB)" d="M70.556 29.999h-6.667v40h6.667z" /><defs><linearGradient id="nextA" x1="60.556" x2="80.278" y1="64.721" y2="89.166" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient><linearGradient id="nextB" x1="67.222" x2="67.111" y1="29.999" y2="59.374" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs></svg>
                    </div>
                    <span className="text-[9px] text-white/70 text-center">Next.js</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 lg:w-12 lg:h-12">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#06B6D4" d="M50 20q-20 0-25 19.994 7.5-9.997 17.5-7.498c3.804.95 6.522 3.71 9.532 6.764 4.902 4.974 10.576 10.731 22.969 10.731q20 0 24.999-19.995-7.5 9.997-17.5 7.5c-3.803-.951-6.521-3.71-9.531-6.765C68.067 25.758 62.392 20 50 20M25 49.991q-20 0-25 19.995 7.5-9.998 17.5-7.498c3.803.952 6.522 3.71 9.532 6.763C31.933 74.225 37.608 79.984 50 79.984q20 0 25-19.995-7.5 9.997-17.5 7.498c-3.803-.95-6.522-3.71-9.532-6.763C43.066 55.75 37.393 49.991 25 49.991" /></svg>
                    </div>
                    <span className="text-[9px] text-white/70 text-center">Tailwind</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 lg:w-12 lg:h-12">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#017ACB" d="M0 0h100v100H0z" /><path fill="#fff" d="M48.016 37.031h4.797v8.282h-12.97v36.843l-.343.094c-.469.125-6.64.125-7.969-.016l-1.062-.093V45.312H17.5v-8.28l4.11-.048c2.25-.03 8.03-.03 12.843 0 4.813.032 10.906.047 13.563.047m36.61 41.219c-1.907 2.016-3.954 3.14-7.36 4.063-1.485.406-1.735.421-5.078.406-3.344-.016-3.61-.016-5.235-.438-4.203-1.078-7.594-3.187-9.906-6.172-.656-.843-1.734-2.593-1.734-2.812 0-.063.156-.203.359-.297s.625-.36.969-.562c.343-.204.968-.579 1.39-.797.422-.22 1.64-.938 2.703-1.579 1.063-.64 2.032-1.156 2.141-1.156.11 0 .313.219.469.485.937 1.578 3.125 3.593 4.672 4.28.953.407 3.062.86 4.078.86.937 0 2.656-.406 3.578-.828.984-.453 1.484-.906 2.078-1.812.406-.641.453-.813.438-2.032 0-1.125-.063-1.437-.375-1.953-.875-1.437-2.063-2.187-6.875-4.312-4.97-2.203-7.204-3.516-9.016-5.282-1.344-1.312-1.61-1.67-2.453-3.312-1.094-2.11-1.235-2.797-1.25-5.937-.016-2.204.031-2.922.265-3.672.329-1.125 1.391-3.297 1.875-3.844 1-1.172 1.36-1.531 2.063-2.11 2.125-1.75 5.438-2.906 8.61-3.015.359 0 1.546.062 2.656.14 3.187.266 5.359 1.047 7.453 2.72 1.578 1.25 3.968 4.187 3.734 4.577-.156.235-6.39 4.391-6.797 4.516-.25.078-.422-.016-.765-.422-2.125-2.547-2.985-3.094-5.047-3.219-1.469-.093-2.25.078-3.235.735-1.03.687-1.53 1.734-1.53 3.187.015 2.125.827 3.125 3.827 4.61 1.938.953 3.594 1.734 3.719 1.734.188 0 4.203 2 5.25 2.625 4.875 2.86 6.86 5.797 7.375 10.86.375 3.812-.703 7.296-3.047 9.765" /></svg>
                    </div>
                    <span className="text-[9px] text-white/70 text-center">TypeScript</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                      <svg viewBox="0 0 256 256" className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="none"/><line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" className="text-white"/><line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" className="text-white"/></svg>
                    </div>
                    <span className="text-[9px] text-white/70 text-center">shadcn/ui</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 lg:w-12 lg:h-12">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="w-full h-full"><path fill="#000" fillRule="evenodd" d="M100 93.957 50 7 0 93.957z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-[9px] text-white/70 text-center">Vercel</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="w-full bg-black py-16 md:py-24 px-4 md:px-8">
        <div className="w-full md:w-10/12 mx-auto">
          {/* Header */}
          <div className="text-center -mb-8 md:-mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-2">
              {techStackT.title}
            </h2>
            <p className="text-base md:text-lg text-white/60">
              {techStackT.subtitle}
            </p>
          </div>

          {/* Animated Tech Stack */}
          <TechStackBeam />
        </div>
      </section>

      {/* Featured Work Header - Divider */}
      <section id="work" className="w-full bg-black py-12 md:py-16 px-4 md:px-8">
        <div className="w-full md:w-10/12 mx-auto">
          <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 text-xs font-medium tracking-widest uppercase border border-white/20 rounded-full bg-white/5 backdrop-blur-sm text-white/80 mb-4 md:mb-6">
            {workT.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
            {workT.title}
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-3xl">
            {workT.subtitle}
          </p>
        </div>
      </section>

      {/* Featured Work Section - Horizontal Scroll */}
      <HorizontalScrollSection workT={workT} navT={navT} />

      {/* Experience Timeline Section */}
      <section id="experience" className="w-full bg-black py-16 md:py-20 px-4 md:px-8">
        <div className="w-full md:w-10/12 mx-auto">
          {/* Header */}
          <div className="mb-10 md:mb-12">
            <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 text-xs font-medium tracking-widest uppercase border border-white/20 rounded-full bg-white/5 backdrop-blur-sm text-white/80 mb-4 md:mb-6">
              {experienceT.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              {experienceT.title}
            </h2>
            <p className="text-base md:text-lg text-white/60 max-w-3xl">
              {experienceT.subtitle}
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-transparent"></div>

            {/* Experience Items */}
            <div className="space-y-8 md:space-y-10">
              {experienceT.positions.map((position: any, index: number) => (
                <div key={index} className="relative grid md:grid-cols-2 gap-6 md:gap-8">
                  {index % 2 === 0 ? (
                    <>
                      <div className="md:text-right md:pr-6 pl-8 md:pl-0">
                        <div className="flex items-start gap-2 md:gap-3 md:flex-row-reverse md:justify-end">
                          <button
                            onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                            className="flex-shrink-0 mt-0.5 group"
                          >
                            <svg
                              className={`w-4 h-4 md:w-5 md:h-5 text-purple-400 transition-transform duration-300 ${expandedItem === index ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className="flex-1 text-left md:text-right">
                            <h3
                              className="text-lg md:text-xl font-bold text-white hover:text-purple-400 transition-colors mb-1.5 md:mb-2 cursor-pointer"
                              onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                            >
                              {position.role}
                            </h3>
                            <p className="text-xs md:text-sm text-white/40 uppercase tracking-wider mb-1.5 md:mb-2">{position.company} · {position.location}</p>
                            <p className="text-xs md:text-sm text-purple-400 mb-2 md:mb-3">{position.period}</p>
                            {expandedItem === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                                  {position.description}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="md:pl-6 hidden md:block">
                        <div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-purple-500 rounded-full -translate-x-1/2 ring-4 ring-black"></div>
                      </div>
                      <div className="md:hidden absolute left-0 top-0 w-3 h-3 bg-purple-500 rounded-full ring-4 ring-black"></div>
                    </>
                  ) : (
                    <div className="md:col-start-2 md:pl-6 pl-8 md:pl-6">
                      <div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2 md:-translate-x-1/2 ring-4 ring-black"></div>
                      <div className="flex items-start gap-2 md:gap-3">
                        <button
                          onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                          className="flex-shrink-0 mt-0.5 group"
                        >
                          <svg
                            className={`w-4 h-4 md:w-5 md:h-5 text-blue-400 transition-transform duration-300 ${expandedItem === index ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div className="flex-1 text-left">
                          <h3
                            className="text-lg md:text-xl font-bold text-white hover:text-blue-400 transition-colors mb-1.5 md:mb-2 cursor-pointer"
                            onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                          >
                            {position.role}
                          </h3>
                          <p className="text-xs md:text-sm text-white/40 uppercase tracking-wider mb-1.5 md:mb-2">{position.company} · {position.location}</p>
                          <p className="text-xs md:text-sm text-blue-400 mb-2 md:mb-3">{position.period}</p>
                          {expandedItem === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                                {position.description}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full bg-black py-16 md:py-24 px-4 md:px-8">
        <div className="w-full lg:w-10/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side - Contact Info */}
            <div className="flex flex-col justify-start space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {contactT.title}
                </h2>
                <p className="text-base md:text-lg text-white/60 leading-relaxed">
                  {contactT.subtitle}
                </p>
              </div>

              {/* Contact Links */}
              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:leandro.works@outlook.com"
                  className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">leandro.works@outlook.com</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/l-paiva/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">linkedin.com/in/l-paiva</span>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/leandropaiva-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">github.com/leandropaiva-dev</span>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 text-white/80">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base">{contactT.location}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-white/60 mb-2 tracking-wider">
                    {contactT.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={contactT.form.namePlaceholder}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-2 tracking-wider">
                    {contactT.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={contactT.form.emailPlaceholder}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-white/60 mb-2 tracking-wider">
                    {contactT.form.subject}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={contactT.form.subjectPlaceholder}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-white/60 mb-2 tracking-wider">
                    {contactT.form.message}
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={contactT.form.messagePlaceholder}
                    required
                    rows={4}
                    className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? contactT.form.sending : contactT.form.send}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-center text-sm"
                  >
                    {contactT.form.success}
                  </motion.p>
                )}
                {submitStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-center text-sm"
                  >
                    {contactT.form.error}
                  </motion.p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="w-full bg-black py-16 md:py-24 px-4 md:px-8">
        <div className="w-full lg:w-10/12 mx-auto">
          {/* Header */}
          <div className="mb-10 md:mb-12">
            <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 text-xs font-medium tracking-widest uppercase border border-white/20 rounded-full bg-white/5 backdrop-blur-sm text-white/80 mb-4 md:mb-6">
              {blogT.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
              {blogT.title}
            </h2>
            <p className="text-base md:text-lg text-white/60 max-w-3xl">
              {blogT.subtitle}
            </p>
          </div>

          {/* Blog Grid */}
          {loadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                  <div className="w-full aspect-video bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-full mb-1"></div>
                  <div className="h-3 bg-white/10 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogPosts.map((post: any) => (
                <BlogCard key={post.id} post={post} locale={locale} blogT={blogT} />
              ))}
            </div>
          ) : (
            <div className="text-center text-white/40 py-12">
              No posts found
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full bg-gradient-to-b from-black via-black to-purple-950/10 border-t border-white/10 pt-20 pb-8 px-4 md:px-8 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none"></div>

        <div className="relative w-full lg:w-10/12 mx-auto">
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-5">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Leandro Paiva
                  </h3>
                  <p className="text-sm text-purple-400/80 font-medium">Front-End Developer</p>
                </div>

                <p className="text-base text-white/50 leading-relaxed max-w-md">
                  {footerT.description}
                </p>

                {/* Social Links with hover effects */}
                <div className="flex gap-3 pt-2">
                  <a
                    href="mailto:leandro.works@outlook.com"
                    className="group relative w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                    aria-label="Email"
                  >
                    <svg className="w-5 h-5 text-white/70 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-purple-500/20 blur-xl"></div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/l-paiva/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5 text-white/70 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/20 blur-xl"></div>
                  </a>

                  <a
                    href="https://github.com/leandropaiva-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 blur-xl"></div>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-white/90 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-gradient-to-r from-purple-500 to-transparent"></span>
                {footerT.links}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="text-sm text-white/50 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-px bg-purple-400 transition-all duration-300"></span>
                    {navT.about}
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-sm text-white/50 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-px bg-purple-400 transition-all duration-300"></span>
                    {navT.projects}
                  </a>
                </li>
                <li>
                  <a href="#experience" className="text-sm text-white/50 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-px bg-purple-400 transition-all duration-300"></span>
                    {navT.experience}
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-sm text-white/50 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-px bg-purple-400 transition-all duration-300"></span>
                    {navT.blog}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-white/50 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-px bg-purple-400 transition-all duration-300"></span>
                    {navT.contact}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-bold text-white/90 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-gradient-to-r from-purple-500 to-transparent"></span>
                {footerT.connect}
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm text-white/70">Porto, Portugal 🇵🇹</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:leandro.works@outlook.com" className="text-sm text-white/70 hover:text-purple-400 transition-colors">
                      leandro.works@outlook.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <p className="text-xs text-white/30">
                © {new Date().getFullYear()} Leandro Paiva
              </p>
              <div className="hidden md:block w-px h-4 bg-white/10"></div>
              <p className="text-xs text-white/30">
                {footerT.rights}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/30">
              <span>Crafted with</span>
              <span className="text-red-400 animate-pulse">♥</span>
              <span>in Portugal</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
