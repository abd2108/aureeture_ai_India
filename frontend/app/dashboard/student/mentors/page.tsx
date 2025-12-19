"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  ShieldCheck,
  Linkedin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types & Data ---
type Expert = {
  id: string | number;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  avatarInitial: string;
  rating: number;
  reviews: number;
  expertise: string[];
  price: number;
  availability: string;
  domain: string;
  experience: string;
  verified: boolean;
  linkedinUrl: string;
};

const allExperts: Expert[] = [
  {
    id: 1,
    name: "Aditi Sharma",
    role: "Director of Engineering",
    company: "Google",
    companyLogo: "",
    avatarInitial: "AS",
    rating: 4.9,
    reviews: 128,
    expertise: ["System Design", "Scalability"],
    price: 5000,
    availability: "Tomorrow",
    domain: "Software",
    experience: "12 Yrs",
    verified: true,
    linkedinUrl: "https://www.linkedin.com/in/aditi-sharma",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    role: "Principal PM",
    company: "Microsoft",
    companyLogo: "",
    avatarInitial: "RM",
    rating: 4.8,
    reviews: 94,
    expertise: ["Product Strategy", "B2B SaaS"],
    price: 4200,
    availability: "Tue, 12 Dec",
    domain: "Product",
    experience: "9 Yrs",
    verified: true,
    linkedinUrl: "https://www.linkedin.com/in/rohan-mehta",
  },
  {
    id: 3,
    name: "Sameer Khan",
    role: "Lead Data Scientist",
    company: "Amazon",
    companyLogo: "",
    avatarInitial: "SK",
    rating: 5.0,
    reviews: 210,
    expertise: ["AI/ML", "Python"],
    price: 3500,
    availability: "Available Now",
    domain: "Data Science",
    experience: "8 Yrs",
    verified: true,
    linkedinUrl: "https://www.linkedin.com/in/sameer-khan",
  },
  {
    id: 4,
    name: "Priya Singh",
    role: "Senior UX Designer",
    company: "Cred",
    companyLogo: "",
    avatarInitial: "PS",
    rating: 4.9,
    reviews: 180,
    expertise: ["Design Systems", "Figma"],
    price: 2800,
    availability: "Wed, 13 Dec",
    domain: "Design",
    experience: "7 Yrs",
    verified: false,
    linkedinUrl: "https://www.linkedin.com/in/priya-singh",
  },
  {
    id: 5,
    name: "Vikram Kumar",
    role: "Staff Engineer",
    company: "Zerodha",
    companyLogo: "",
    avatarInitial: "VK",
    rating: 4.9,
    reviews: 150,
    expertise: ["Backend", "Golang"],
    price: 3000,
    availability: "Thu, 14 Dec",
    domain: "Software",
    experience: "10 Yrs",
    verified: true,
    linkedinUrl: "https://www.linkedin.com/in/vikram-kumar",
  },
  {
    id: 6,
    name: "Ananya Gupta",
    role: "Marketing Head",
    company: "Zomato",
    companyLogo: "",
    avatarInitial: "AG",
    rating: 4.7,
    reviews: 85,
    expertise: ["Growth", "Brand"],
    price: 2500,
    availability: "Fri, 15 Dec",
    domain: "Marketing",
    experience: "6 Yrs",
    verified: false,
    linkedinUrl: "https://www.linkedin.com/in/ananya-gupta",
  },
];

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{value}</span>
    </div>
  </div>
);

export default function StudentMentorsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  
  // FIX: Hardcoded experts to ensure they render no matter what
  const [experts, setExperts] = useState<Expert[]>(allExperts);
  const [loading, setLoading] = useState(false);

  const stats = {
    totalMentors: 124,
    avgHourlyRate: 3200,
    activeSessions: 3,
    satisfaction: "4.9",
  };

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      const matchesSearch =
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain =
        selectedDomain === "All" || expert.domain === selectedDomain;
      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain, experts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Mentorship</h1>
        <p className="text-sm text-zinc-500">Connect with industry experts for guidance and career advice.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Mentors" value={stats.totalMentors.toString()} />
        <StatCard label="Avg. Hourly Rate" value={`₹${stats.avgHourlyRate.toLocaleString("en-IN")}`} />
        <StatCard label="Active Sessions" value={stats.activeSessions.toString()} />
        <StatCard label="Satisfaction" value={`${stats.satisfaction}/5.0`} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by name, company..."
            className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-zinc-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 gap-2">
                <Filter size={14} />
                {selectedDomain}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedDomain("All")}>All Domains</DropdownMenuItem>
              {["Software", "Product", "Data Science", "Design", "Marketing"].map((d) => (
                <DropdownMenuItem key={d} onClick={() => setSelectedDomain(d)}>{d}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-9 border border-zinc-200 dark:border-zinc-800 rounded-md flex p-0.5 bg-white dark:bg-zinc-900">
            <button onClick={() => setViewMode("grid")} className={`px-2.5 rounded-sm flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400"}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`px-2.5 rounded-sm flex items-center justify-center transition-all ${viewMode === "list" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {filteredExperts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">No mentors found</p>
          <p className="text-xs text-zinc-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"}
          >
            {filteredExperts.map((expert) => (
              <div key={expert.id} className={`group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 ${viewMode === "list" ? "flex items-center p-4 gap-6" : "p-5 flex flex-col"}`}>
                <div className={`flex items-start gap-4 ${viewMode === "list" ? "flex-1" : "mb-4"}`}>
                  <Avatar className="h-12 w-12 border border-zinc-100 dark:border-zinc-800 rounded-lg">
                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg">{expert.avatarInitial}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{expert.name}</h3>
                      {expert.verified && <ShieldCheck size={14} className="text-zinc-400" />}
                    </div>
                    <p className="text-sm text-zinc-500 flex items-center gap-1">{expert.role}, <span className="font-medium text-zinc-700 dark:text-zinc-300">{expert.company}</span></p>
                    <a href={expert.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 underline-offset-2 hover:underline">
                      <Linkedin className="h-3.5 w-3.5" />
                      <span>View LinkedIn</span>
                    </a>
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-zinc-900 dark:fill-zinc-100 text-zinc-900 dark:text-zinc-100" />
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{expert.rating}</span>
                      <span className="text-zinc-400">({expert.reviews})</span>
                    </div>
                    <div className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
                    <span>{expert.experience} Exp.</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {expert.expertise.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-normal">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                  <div className="font-mono">
                    <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">₹{expert.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-zinc-500"> / session</span>
                  </div>
                  <Button size="sm" className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm" onClick={() => setSelectedExpert(expert)}>Book Now</Button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <Dialog open={!!selectedExpert} onOpenChange={() => setSelectedExpert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedExpert ? `Book a session with ${selectedExpert.name}` : ""}</DialogTitle>
            <DialogDescription>This is a preview booking flow.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedExpert(null)}>Cancel</Button>
            <Button onClick={() => router.push(`/dashboard/student/booking/slot-selection?mentorId=${selectedExpert?.id}`)}>Book Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}