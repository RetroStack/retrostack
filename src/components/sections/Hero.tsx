"use client";

import Image from "next/image";
import Link from "next/link";
import { GridBackground } from "@/components/effects/GridBackground";
import { NeonText } from "@/components/effects/NeonText";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <GridBackground
      animated
      overlay
      className="min-h-screen flex items-center justify-center pt-20"
    >
      <Container className="relative z-10 text-center py-20">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
            <Image
              src="/images/logo.png"
              alt={SITE_CONFIG.name}
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(255,42,109,0.5)]"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4">
          <NeonText
            as="span"
            color="pink"
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl block"
          >
            {SITE_CONFIG.name}
          </NeonText>
        </h1>

        {/* Tagline */}
        <p className="font-ui text-lg sm:text-xl md:text-2xl text-retro-cyan mb-8">
          {SITE_CONFIG.tagline}
        </p>

        {/* Description */}
        <p className="font-terminal text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          {SITE_CONFIG.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/systems"
            className="btn-neon btn-neon-pink px-8 py-3 text-sm"
          >
            Explore Systems
          </Link>
          <Link
            href="/tools"
            className="btn-neon btn-neon-cyan px-8 py-3 text-sm"
          >
            Try Our Tools
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-retro-violet"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </Container>
    </GridBackground>
  );
}
