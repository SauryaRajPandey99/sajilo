import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "125K+",
    label: "Happy Customers",
  },
  {
    value: "$8.5B+",
    label: "Money Managed",
  },
  {
    value: "99.99%",
    label: "Reliability",
  },
  {
    value: "4.8/5",
    label: "Average Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-lime-600" />,
    title: "Intelligent Reporting",
    description:
      "Discover spending trends and financial patterns through machine learning-driven analysis",
  },
  {
    icon: <Receipt className="h-8 w-8 text-lime-600" />,
    title: "Instant Receipt Processing",
    description:
      "Scan and digitize receipts in seconds with optical character recognition",
  },
  {
    icon: <PieChart className="h-8 w-8 text-lime-600" />,
    title: "Personalized Budgets",
    description:
      "Set financial goals and receive custom budget strategies tailored to you",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-lime-600" />,
    title: "Unified Account Management",
    description:
      "Connect all your bank accounts and cards for a complete financial overview",
  },

  {
    icon: <Zap className="h-8 w-8 text-lime-600" />,
    title: "Smart Notifications",
    description:
      "Receive proactive alerts and personalized money-saving suggestions",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-lime-600" />,
    title: "1. Sign Up & Connect",
    description:
      "Join in under 2 minutes and securely link your financial accounts",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-lime-600" />,
    title: "2. Monitor Expenses",
    description:
      "Watch your spending automatically organize into categories as transactions occur",
  },
  {
    icon: <PieChart className="h-8 w-8 text-lime-600" />,
    title: "3. Optimize Your Money",
    description:
      "Leverage smart recommendations to make better financial decisions every day",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "David Martinez",
    role: "Startup Founder",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    quote:
      "Welth gives me complete visibility into our company's cash flow. The automated categorization alone saves us 10+ hours weekly.",
  },
  {
    name: "Jessica Wong",
    role: "Creative Director",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "Finally, an expense tracker that actually works! The AI catches things I miss and the mobile app is incredibly intuitive.",
  },
  {
    name: "Robert Thompson",
    role: "Real Estate Investor",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    quote:
      "Managing multiple properties was chaos before Welth. Now everything is organized, and the reporting features are exceptional.",
  },
];
