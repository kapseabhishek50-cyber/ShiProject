import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function FoldcraftHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = ['Home', 'Projects', 'Studio', 'Reach Us'];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-geist">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: '70% center' }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4"
      />

      {/* Mobile Menu Overlay (z-20) */}
      <div
        className={`absolute inset-x-0 top-0 z-20 bg-black/98 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen
            ? 'h-screen opacity-100'
            : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex h-full flex-col justify-center px-8 transition-all duration-500 ${
            mobileMenuOpen
              ? 'delay-100 translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <nav className="space-y-6">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-3xl font-medium text-white/90 transition-colors hover:text-white"
              >
                {link}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="mt-6 rounded-full bg-white px-8 py-3.5 text-base font-medium text-black transition-transform hover:scale-105"
          >
            Let's Talk
          </button>
        </div>
      </div>

      {/* Navbar (z-30) */}
      <nav className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-8 sm:gap-12">
          <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            Foldcraft
          </h2>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <button
                key={link}
                className="text-sm text-white/80 transition-colors hover:text-white"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Desktop CTA + Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button className="hidden rounded-lg bg-white px-5 py-2 text-sm font-medium text-black transition-transform hover:scale-105 md:inline-block">
            Let's Talk
          </button>

          {/* Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center transition-transform active:scale-90 md:hidden"
            aria-label="Toggle mobile menu"
          >
            <Menu
              size={24}
              className={`absolute text-white transition-all duration-300 ${
                mobileMenuOpen
                  ? 'rotate-90 scale-0 opacity-0'
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              size={24}
              className={`absolute text-white transition-all duration-300 ${
                mobileMenuOpen
                  ? 'rotate-0 scale-100 opacity-100'
                  : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Hero Content (z-10) */}
      <div className="relative z-10 flex h-[calc(100vh-80px)] flex-col justify-between px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16">
        {/* Top Section */}
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="mb-4 animate-[fadeSlideUp_0.8s_ease_0.2s_both] text-xs text-white/90 sm:mb-6 sm:text-sm">
            Brand &amp; Visual Storytelling
          </div>

          {/* Heading */}
          <h1 className="animate-[fadeSlideUp_0.8s_ease_0.4s_both] text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Shaping visual <br /> narratives, <br /> one pixel at a time.
          </h1>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Description */}
          <p className="mb-5 max-w-sm animate-[fadeSlideUp_0.8s_ease_0.7s_both] text-sm leading-relaxed text-white/60 sm:mb-6 sm:max-w-lg sm:text-base md:text-lg">
            Turning vision into reality through craft, motion, and an endless
            pursuit of beauty.
          </p>

          {/* CTA Button */}
          <button className="inline-flex animate-[fadeSlideUp_0.8s_ease_0.9s_both] items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105 sm:px-6 sm:py-3">
            Explore Work
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
