'use client';
import Image from "next/image";
import { Button } from "./ui/button";
import Link from 'next/link'
import { useEffect, useRef } from "react";

const HeroSection = () => {

    const imageRef= useRef();

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll=() => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100; 

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
        }
        else {
            imageElement.classList.remove("scrolled");
        }
    };
    
    window.addEventListener("scroll", handleScroll);   
    
    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
}, []);

  return (
    <div className="pb-20 px-4">
        <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 bg-gradient-to-br from-lime-600 via-blue-400 to-green-600 bg-clip-text text-transparent font-extrabold tracking-tighter pr-2">
  
                Welcome to Sajilo <br /> Your Personal Budgeting Companion!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                An intuitive platform to help you manage your finances effortlessly. Track expenses, set budgets, and achieve your financial goals with ease.
            </p>
            <div className="flex justify-center space-x-4">
                <Link href="/dashboard">
                    <Button size="lg" className='px-8'>
                        Get Started
                    </Button>
                </Link>
                <Link href="https://sauryarajpandey.com.np/">
                    <Button size="lg" variant="outline" className='px-8'>
                        Watch demo
                    </Button>
                </Link>
            </div>
            <div className="hero-image-wrapper">
                <div ref={imageRef} className="hero-image">
                    <Image 
                    src="/banner.png" 
                    alt="Dashboard Preview" 
                    className="rounded-lg shadow-2xl border mx-auto"
                    priority
                    width={1280} 
                    height={720}/>
                </div>
            </div>
        </div>

        </div>
  )
}

export default HeroSection