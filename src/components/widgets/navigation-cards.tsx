import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, BarChart2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NavigationCards() {
  const cards = [
    {
      title: "Time Table & Journal",
      description: "Plan your days, log activities, and journal your reflections.",
      icon: Calendar,
      href: "/timetable",
      gradient: "from-blue-500/10 to-cyan-500/10",
      borderHover: "hover:border-blue-500/50",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Course Tracker",
      description: "Import courses, track video progress, and manage your learning path.",
      icon: BookOpen,
      href: "/courses",
      gradient: "from-emerald-500/10 to-teal-500/10",
      borderHover: "hover:border-emerald-500/50",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      title: "Deep Analytics",
      description: "Visualize your habits with heatmaps, streaks, and performance metrics.",
      icon: BarChart2,
      href: "/analytics",
      gradient: "from-purple-500/10 to-fuchsia-500/10",
      borderHover: "hover:border-purple-500/50",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Link href={card.href} key={index}>
            <Card className={`bg-gradient-to-br ${card.gradient} dark:bg-gradient-to-br shadow-sm border-gray-200 dark:border-gray-800 transition-all duration-300 cursor-pointer h-full ${card.borderHover} hover:shadow-lg group relative overflow-hidden`}>
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full" style={{ transition: 'transform 0.7s, opacity 0.3s' }} />
              
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transform group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
