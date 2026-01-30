import Image from "next/image";
import { featuresData, howItWorksData, statsData, testimonialsData } from "../../data/landing";
import HeroSection from "../components/hero";
import { Card, CardContent } from "../components/ui/card";
import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="mt-40">

      <HeroSection />
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8"> 
            {statsData.map((statsData,index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{statsData.value}</div>
                <div className="text-gray-600">{statsData.label}</div>
              </div>  
            ))}
          </div>
        </div>
      </section>


      <section className="py-20">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
      Everything you need to manage your finances in one place. We make it easy to track your spending, create budgets, and achieve your financial goals.
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuresData.map((feature, index) => (
        <Card key={index} className="p-6 hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 group">
          <CardContent className="space-y-4 pt-2">
            <div className="group-hover:animate-pulse p-3 rounded-lg">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>  
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


      <section className="py-20 bg-green-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                  How the App Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howItWorksData.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">{step.icon}</div>
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-gray-600 ">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
      </section>

      
    <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                 What our Users Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonialsData.map((testimonial, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300"> 
                    <CardContent className="pt-4">
                    <div className="flex items-center mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full mb-4"
                      />
                      <div className="ml-4">
                       <div className="font-semibold">
                        {testimonial.name}
                       </div>
                       <div className="text-sm text-gray-600">
                         {testimonial.role}
                       </div>
                      </div>
                    </div>
                    <p className="text-gray-600 ">{testimonial.quote}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
      </section>
    
      <section className="py-20 bg-green-600">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                 Ready to Take Control of Your Finances?
              </h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Sign up today and start your journey of being smarter with Sajilo.
              </p>
            <Link href='/dashboard'> 
            <Button 
            size="lg"
            className="bg-white text-green-600 hover:bg-green-50 animate-bounce"
            >
              Start Your Free Trial
            </Button>
            </Link>
            </div>
      </section>
    </div>
  );
}
