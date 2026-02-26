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
  const imageRef = useRef();
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
    <>
      {/* <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `,
        }}
      /> */}

      <div className="relative min-h-screen flex flex-col justify-center overflow-hidden -mt-20 pt-20">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-lime-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-blue-950 dark:to-green-950">
          <div
            className="absolute inset-0 opacity-30 transition-transform duration-100"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(132, 204, 22, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`,
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 pt-20 pb-32">
          {/* Floating badge */}
          <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-lime-200 dark:border-green-800 shadow-lg">
              <Sparkles className="w-4 h-4 text-lime-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your financial journey starts here
              </span>
            </div>
          </div>

          {/* Main heading with staggered animation */}
          <div className="text-center max-w-5xl mx-auto mb-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <span className="block bg-linear-to-br from-lime-600 via-blue-400 to-green-600 bg-clip-text text-transparent">
                Master Your Money
              </span>
              <span className="block text-gray-900 dark:text-white mt-2">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300"
                >
                  <feature.icon className="w-4 h-4 text-lime-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
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

          {/* Dashboard Preview with 3D Effect */}
          <div
            className="relative max-w-6xl mx-auto"
            style={{ perspective: "1000px" }}
          >
            <div
              ref={imageRef}
              className={`relative transition-all duration-500 ease-out ${
                isScrolled ? "scale-95 -translate-y-5" : "scale-100"
              }`}
              style={{
                transform: `perspective(1000px) rotateX(${Math.min(scrollY * 0.02, 5)}deg)`,
              }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-linear-to-r from-lime-600 via-blue-400 to-green-600 rounded-2xl opacity-20 blur-3xl animate-pulse" />

              {/* Image container */}
              <div className="relative rounded-2xl overflow-hidden border-4 border-white/20 dark:border-gray-800/20 shadow-2xl bg-white/5 backdrop-blur-sm">
                <Image
                  src="/banner.png"
                  alt="Sajilo Dashboard Preview"
                  className="w-full h-auto"
                  priority
                  width={1280}
                  height={720}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
