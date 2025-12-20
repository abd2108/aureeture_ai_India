"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  isBooked: boolean;
}

interface MentorInfo {
  name: string;
  role: string;
  company: string;
  price: number;
  avatarInitial: string;
  mentorId: string;
}
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
const SlotSelectionPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  // Get mentor info from URL params
  const mentorInfo: MentorInfo = {
    name: searchParams.get("name") || "",
    role: searchParams.get("role") || "",
    company: searchParams.get("company") || "",
    price: Number(searchParams.get("price")) || 0,
    avatarInitial: searchParams.get("name")?.charAt(0) || "M",
    mentorId: searchParams.get("mentorId") || "",
  };

  useEffect(() => {
    if (!mentorInfo.mentorId) {
      setError("Mentor information is missing. Please go back and try again.");
      return;
    }
    fetchAvailableSlots();
  }, [currentWeek, mentorInfo.mentorId]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      
      // If no API base URL is configured, use mock data directly
      if (!apiBase) {
        console.log("No API base URL configured, using mock data");
        generateMockSlots();
        setLoading(false);
        return;
      }

      const startOfWeek = new Date(currentWeek);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const res = await fetch(
        `${apiBase}/api/mentor-availability/slots?mentorId=${encodeURIComponent(
          mentorInfo.mentorId
        )}&startDate=${startOfWeek.toISOString()}&endDate=${endOfWeek.toISOString()}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch available slots");
      }

      const data = await res.json();
      
      // If API returns empty slots or no slots, use mock data
      if (!data.slots || data.slots.length === 0) {
        console.log("API returned no slots, using mock data");
        generateMockSlots();
        setLoading(false);
        return;
      }

      setSlots(
        data.slots.map((s: any) => ({
          id: s.id,
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime),
          isAvailable: s.isAvailable,
          isBooked: s.isBooked,
        }))
      );
    } catch (err: any) {
      console.warn("Error fetching slots from API, using mock data:", err);
      // Generate mock slots for demo - don't show error to user
      generateMockSlots();
      // Only show a subtle info message, not an error
      // setError is not called here to avoid showing error banner
    } finally {
      setLoading(false);
    }
  };

  const generateMockSlots = () => {
    const mockSlots: TimeSlot[] = [];
    const today = new Date();
    
    // Generate slots for the next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Skip weekends for more realistic data (optional)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend - fewer slots
        [14, 18].forEach((hour) => {
          const startTime = new Date(date);
          startTime.setHours(hour, 0, 0, 0);
          const endTime = new Date(startTime);
          endTime.setHours(hour + 1, 0, 0, 0);
          mockSlots.push({
            id: `slot-${date.getTime()}-${hour}`,
            startTime,
            endTime,
            isAvailable: true,
            isBooked: false,
          });
        });
      } else {
        // Weekdays - more slots (10 AM, 2 PM, 6 PM)
        [10, 14, 18].forEach((hour) => {
          const startTime = new Date(date);
          startTime.setHours(hour, 0, 0, 0);
          const endTime = new Date(startTime);
          endTime.setHours(hour + 1, 0, 0, 0);
          mockSlots.push({
            id: `slot-${date.getTime()}-${hour}`,
            startTime,
            endTime,
            isAvailable: true, // All mock slots are available
            isBooked: false,
          });
        });
      }
    }
    
    // Sort slots by start time
    mockSlots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setSlots(mockSlots);
  };

  // 1. Add this list at the top of your component (or ensure it's imported)
// This must match the list from your mentors page exactly
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

// ... inside your SlotSelectionPage component ...

const handleProceedToPayment = () => {
  if (!selectedSlot || !user) return;

  // FIX: Look up the mentor details using the ID from the URL
  const mId = searchParams.get("mentorId");
  const mentor = allExperts.find(e => String(e.id) === String(mId));

  const params = new URLSearchParams({
    ...Object.fromEntries(searchParams.entries()),
    // Now we use the mentor object we found
    name: mentor?.name || "Mentor",
    price: "1",
    role: mentor?.role || "",
    company: mentor?.company || "",
    
    selectedSlotId: selectedSlot.id,
    selectedStartTime: selectedSlot.startTime.toISOString(),
    selectedEndTime: selectedSlot.endTime.toISOString(),
    studentId: user.id || `student_${Date.now()}`,
    studentName: user.fullName || user.firstName || "Student",
    studentEmail: user.primaryEmailAddress?.emailAddress || "",
  });

  router.push(`/dashboard/payment?${params.toString()}`);
};

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const grouped: { [key: string]: TimeSlot[] } = {};
    slots.forEach((slot) => {
      const dateKey = slot.startTime.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate(slots.filter((s) => s.isAvailable && !s.isBooked));

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-6 dark:bg-zinc-950/60 lg:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Select a Time Slot
            </h1>
            <p className="text-sm text-zinc-500">
              Choose your preferred time for the mentoring session
            </p>
          </div>
        </div>

        {/* Mentor Info Card */}
        <Card className="border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border border-zinc-200 dark:border-zinc-800">
                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                  {mentorInfo.avatarInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {mentorInfo.name}
                </h3>
                <p className="text-sm text-zinc-500">
                  {mentorInfo.role} @ {mentorInfo.company}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  ₹{mentorInfo.price.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-zinc-500">per session</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const prevWeek = new Date(currentWeek);
              prevWeek.setDate(prevWeek.getDate() - 7);
              setCurrentWeek(prevWeek);
            }}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Week
          </Button>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {formatDate(new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay())))}{" "}
            -{" "}
            {formatDate(
              new Date(
                new Date(currentWeek).setDate(
                  currentWeek.getDate() - currentWeek.getDay() + 6
                )
              )
            )}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nextWeek = new Date(currentWeek);
              nextWeek.setDate(nextWeek.getDate() + 7);
              setCurrentWeek(nextWeek);
            }}
            className="gap-2"
          >
            Next Week
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Error Alert - Only show critical errors */}
        {error && error.includes("Mentor information is missing") && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Available Slots */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
              Loading available slots...
            </div>
          </div>
        ) : Object.keys(groupedSlots).length === 0 ? (
          <Card className="border border-zinc-200/80 bg-white/95 dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                No available slots this week
              </p>
              <p className="text-xs text-zinc-500">
                Try selecting a different week or contact the mentor directly.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSlots).map(([dateKey, dateSlots]) => (
              <Card
                key={dateKey}
                className="border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {formatDate(new Date(dateKey))}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {dateSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <motion.button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-zinc-500" />
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {formatTime(slot.startTime)}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-indigo-600 ml-auto" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">
                            {formatTime(slot.endTime)}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Proceed Button */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            {selectedSlot && (
              <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                <span>
                  Selected: {formatDate(selectedSlot.startTime)} at{" "}
                  {formatTime(selectedSlot.startTime)}
                </span>
              </div>
            )}
          </div>
          <Button
            onClick={handleProceedToPayment}
            disabled={!selectedSlot}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Proceed to Payment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlotSelectionPage;

