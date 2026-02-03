import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center overflow-hidden">
      {/* Background Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* 404 */}
        <h1 className="text-9xl font-extrabold bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
          404
        </h1>

        {/* Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 mx-auto rounded-full my-4"></div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>

        {/* Button */}
        <Link href="/">
          <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;