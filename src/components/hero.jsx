"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  Wallet,
  Target,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const HeroSection = () => {
  const imageRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: Wallet, text: "Smart Budgeting" },
    { icon: TrendingUp, text: "Expense Tracking" },
    { icon: Target, text: "Goal Planning" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden -mt-20 pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-lime-50/40 to-blue-50/50 dark:from-gray-950 dark:via-gray-950 dark:to-slate-900">
        <div
          className="absolute inset-0 transition-transform duration-100"
          style={{
            transform: `translateY(${scrollY * 0.25}px)`,
            backgroundImage: `
              radial-gradient(circle at 18% 22%, rgba(132, 204, 22, 0.12), transparent 28%),
              radial-gradient(circle at 82% 18%, rgba(59, 130, 246, 0.10), transparent 30%),
              radial-gradient(circle at 50% 78%, rgba(16, 185, 129, 0.08), transparent 30%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      </div>

      <div className="container relative mx-auto px-4 pt-20 pb-32">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your financial journey starts here
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-5xl mx-auto mb-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <span className="block bg-linear-to-r from-lime-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Master Your Money
            </span>
            <span className="block text-gray-950 dark:text-white mt-2">
              With Sajilo
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            Take control of your finances with intelligent budgeting tools.
            Track every penny, visualize spending patterns, and reach your
            financial goals faster than ever.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl px-4 py-2 hover:scale-105 transition-transform duration-300 shadow-sm"
              >
                <feature.icon className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-linear-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="https://sauryarajpandey.com.np/">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Modern Product Frame */}
        <div className="relative max-w-7xl mx-auto">
          {/* Ambient gradient */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
            <div className="absolute right-24 top-10 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
          </div>

          {/* subtle floating chip */}
          <div
            className="hidden md:flex absolute -top-6 left-8 z-20 items-center gap-2 rounded-full border border-white/40 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl px-4 py-2 shadow-lg"
            style={{
              transform: `translateY(${scrollY * 0.08}px)`,
            }}
          >
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Real-time financial overview
            </span>
          </div>

          <div
            ref={imageRef}
            className="relative transition-all duration-500 ease-out"
            style={{
              transform: `
                translateY(${Math.min(scrollY * -0.05, 20)}px)
                scale(${isScrolled ? 1.02 : 1})
              `,
            }}
          >
            {/* main shell */}
            <div className="relative rounded-[32px] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.12)] overflow-hidden">
              {/* top bar */}
              <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>

                <div className="hidden md:flex items-center gap-2 rounded-full border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] px-4 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                  dashboard preview
                </div>

                <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  Sajilo
                </div>
              </div>

              {/* image area */}
              <div className="relative p-2 md:p-4">
                <div className="relative overflow-hidden rounded-[24px] border border-black/5 dark:border-white/10 bg-white dark:bg-gray-950">
                  <Image
                    src="/bannerphoto.png"
                    alt="Sajilo Dashboard Preview"
                    className="w-full h-auto object-cover"
                    priority
                    width={1280}
                    height={720}
                  />

                  {/* subtle overlay */}
                  {/* <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/5" /> */}
                </div>
              </div>
            </div>

            {/* back plate for depth */}
            <div className="absolute -z-10 inset-x-10 -bottom-6 h-20 rounded-full bg-black/10 dark:bg-black/30 blur-2xl" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
