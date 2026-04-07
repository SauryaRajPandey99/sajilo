import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "../../data/landing";
import HeroSection from "../components/hero";
import { Card, CardContent } from "../components/ui/card";
import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="mt-40">
      <HeroSection />

      <section className="py-24 relative overflow-hidden bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNiwgMTg1LCAxMjksIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((statsData, index) => (
              <div
                key={index}
                className="text-center group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
                  <div className="relative text-5xl md:text-6xl font-bold bg-linear-to-br from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                    {statsData.value}
                  </div>
                </div>
                <div className="text-gray-700 font-medium">
                  {statsData.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Modern card design with advanced hover effects */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
              Everything you need to manage your finances{" "}
              <span className="bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                in one place
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              We make it easy to track your spending, create budgets, and
              achieve your financial goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuresData.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-green-400/0 via-emerald-400/0 to-teal-400/0 group-hover:from-green-400/5 group-hover:via-emerald-400/5 group-hover:to-teal-400/5 transition-all duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <CardContent className="relative space-y-5 p-8">
                  <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <div className="text-green-700">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Modern timeline design */}
      <section className="py-24 relative overflow-hidden bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNiwgMTg1LCAxMjksIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              How the App Works
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Simple, powerful, and designed for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorksData.map((step, index) => (
              <div
                key={index}
                className="text-center group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                {/* Connection line for desktop */}
                {index < howItWorksData.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-green-300 to-emerald-300"></div>
                )}

                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-full"></div>
                  <div className="relative w-20 h-20 bg-linear-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <div className="text-white">{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center font-bold text-green-600 text-sm group-hover:scale-125 transition-transform duration-300">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern card design with profile images */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              What our Users Say
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Trusted by thousands of happy users
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-green-400/0 via-emerald-400/0 to-teal-400/0 group-hover:from-green-400/5 group-hover:via-emerald-400/5 group-hover:to-teal-400/5 transition-all duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <CardContent className="relative p-8">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-400 blur-md opacity-40 rounded-full"></div>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="relative rounded-full ring-4 ring-white shadow-lg"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-lg text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <svg
                      className="absolute -top-2 -left-2 w-8 h-8 text-green-200 opacity-50"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                    </svg>
                    <p className="text-gray-700 leading-relaxed relative z-10 pl-6">
                      {testimonial.quote}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern gradient with animated elements */}
      <section className="py-24 relative overflow-hidden bg-linear-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-green-50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Sign up today and start your journey of being smarter with Sajilo.
              Join thousands of users who have transformed their financial
              lives.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="group relative bg-white text-green-600 hover:bg-green-50 px-10 py-7 text-lg font-semibold rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Free Trial
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
