"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface CMPhotoCard {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

const defaultCards: CMPhotoCard[] = [
  {
    id: "formal-flags",
    image: "/images/cm-photo-1.jpg",
    title: "Mir Sarfraz Bugti",
    subtitle: "Chief Minister of Balochistan",
  },
  {
    id: "podium-address",
    image: "/images/chief-minister-portrait.jpg",
    title: "Mir Sarfraz Bugti",
    subtitle: "Chief Minister of Balochistan",
  },
  {
    id: "desk-executive",
    image: "/images/cm-photo-2.jpg",
    title: "Mir Sarfraz Bugti",
    subtitle: "Chief Minister of Balochistan",
  },
  {
    id: "cabinet-glasses",
    image: "/images/cm-photo-3.jpg",
    title: "Mir Sarfraz Bugti",
    subtitle: "Chief Minister of Balochistan",
  },
  {
    id: "official-vest",
    image: "/images/cm-photo-4.jpg",
    title: "Mir Sarfraz Bugti",
    subtitle: "Chief Minister of Balochistan",
  },
];

interface CMCardStackProps {
  cards?: CMPhotoCard[];
}

export function CMCardStack({ cards = defaultCards }: CMCardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = cards.length;

  // Circular offset relative to active card: returns -2, -1, 0, 1, 2
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor(total / 2)) diff += total;
    return diff;
  };

  // Instant hover trigger: the moment cursor enters any card, it glides to front
  const handleCardHover = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  const handleCardClick = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // Responsive horizontal spacing and angle dynamics
  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isSmallMobile = windowWidth < 420;

  const stepX = isDesktop ? 102 : isTablet ? 82 : isSmallMobile ? 36 : 52;
  const activeZ = isDesktop ? 55 : 30;
  const sideZ1 = isDesktop ? -40 : -22;
  const sideZ2 = isDesktop ? -90 : -50;
  const angle1 = isDesktop ? 34 : 22;
  const angle2 = isDesktop ? 58 : 38;

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-2 overflow-hidden max-w-full">
      {/* 3D Perspective Stage */}
      <div
        className="relative w-full h-[290px] min-[400px]:h-[340px] sm:h-[390px] md:h-[430px] flex items-center justify-center overflow-visible"
        style={{
          perspective: isDesktop ? "1050px" : isTablet ? "800px" : "600px",
          WebkitPerspective: isDesktop ? "1050px" : isTablet ? "800px" : "600px",
        }}
      >
        {/* 3D Cylindrical Carousel Scene */}
        <div
          className="relative flex items-center justify-center w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          }}
        >
          {cards.map((card, idx) => {
            const offset = getOffset(idx);
            const isActive = offset === 0;

            // 3D Cylindrical Layout matching reference screenshot:
            // Left cards (offset < 0) turned inward toward center (+rotateY)
            // Right cards (offset > 0) turned inward toward center (-rotateY)
            // Center card (offset = 0) facing forward flat
            let translateX = 0;
            let translateY = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let zIndex = 30;
            let opacity = 1;
            let brightness = 1;

            if (offset === 0) {
              // Active Front Center Card
              translateX = 0;
              translateY = 0;
              translateZ = activeZ;
              rotateY = 0;
              scale = 1.0;
              zIndex = 30;
              opacity = 1;
              brightness = 1;
            } else if (offset === -1) {
              // Near Left Card: Angled inward toward center
              translateX = -stepX * 1.0;
              translateY = 0;
              translateZ = sideZ1;
              rotateY = angle1;
              scale = 0.92;
              zIndex = 20;
              opacity = 0.94;
              brightness = 0.88;
            } else if (offset === 1) {
              // Near Right Card: Angled inward toward center
              translateX = stepX * 1.0;
              translateY = 0;
              translateZ = sideZ1;
              rotateY = -angle1;
              scale = 0.92;
              zIndex = 20;
              opacity = 0.94;
              brightness = 0.88;
            } else if (offset === -2) {
              // Far Left Card: Sharply angled inward (peeking out)
              translateX = -stepX * 1.76;
              translateY = 0;
              translateZ = sideZ2;
              rotateY = angle2;
              scale = 0.85;
              zIndex = 10;
              opacity = 0.86;
              brightness = 0.74;
            } else if (offset === 2) {
              // Far Right Card: Sharply angled inward (peeking out)
              translateX = stepX * 1.76;
              translateY = 0;
              translateZ = sideZ2;
              rotateY = -angle2;
              scale = 0.85;
              zIndex = 10;
              opacity = 0.86;
              brightness = 0.74;
            }

            return (
              <div
                key={card.id}
                onMouseEnter={() => handleCardHover(idx)}
                onClick={() => handleCardClick(idx)}
                aria-label={`${card.title} - ${card.subtitle}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCardClick(idx);
                  }
                }}
                className={`absolute top-0 w-[170px] min-[400px]:w-[205px] sm:w-[235px] md:w-[260px] h-[270px] min-[400px]:h-[320px] sm:h-[370px] md:h-[410px] rounded-[22px] sm:rounded-[28px] overflow-hidden cursor-pointer border-[2.5px] sm:border-[3.5px] border-white/95 backdrop-blur-xl transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive
                    ? "shadow-[0_28px_60px_-12px_rgba(0,0,0,0.5),0_0_25px_rgba(255,255,255,0.3)] ring-1 ring-white/60"
                    : "shadow-[0_16px_36px_-10px_rgba(0,0,0,0.35)] hover:brightness-100"
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  WebkitTransform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  WebkitTransformOrigin: "center center",
                  zIndex,
                  opacity,
                  filter: `brightness(${brightness})`,
                  willChange: "transform, filter, opacity",
                }}
              >
                {/* Photo filling the card */}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 240px, 300px"
                  className={`object-cover object-top transition-transform duration-700 ${
                    isActive ? "scale-100 hover:scale-105" : "scale-100"
                  }`}
                  priority={idx < 3}
                />

                {/* Glassmorphic Specular Highlight Overlay */}
                <div
                  className="absolute inset-0 rounded-[26px] pointer-events-none bg-gradient-to-tr from-white/20 via-transparent to-white/35 opacity-90"
                  aria-hidden="true"
                />

                {/* Glass Inner Rim Highlight */}
                <div
                  className="absolute inset-0 rounded-[26px] pointer-events-none ring-1 ring-inset ring-white/50"
                  aria-hidden="true"
                />

                {/* Glassmorphic Caption Bar (Visible on Active Front Card) */}
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 pt-14 pb-5 px-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none transition-all duration-500">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                      <span className="text-[9px] font-bold tracking-widest text-gold-300 uppercase drop-shadow-sm">
                        Office of the Chief Minister
                      </span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-md leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-white/90 font-medium mt-0.5 drop-shadow-sm tracking-wide">
                      {card.subtitle}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
