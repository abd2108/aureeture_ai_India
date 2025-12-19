"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight, GraduationCap, Users, Briefcase } from "lucide-react";

type RoleConfig = {
  id: "student" | "mentor" | "founder";
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  redirectUrl: string;
  icon: React.ElementType;
};

const ROLES: RoleConfig[] = [
  {
    id: "student",
    title: "Join as a Student / Job Seeker",
    subtitle: "Career-ready in weeks, not years.",
    description:
      "Discover your path, build proof‑of‑work, and track every step of your career momentum in one dashboard.",
    ctaLabel: "Continue as Student",
    redirectUrl: "/dashboard?role=student",
    icon: GraduationCap,
  },
  {
    id: "mentor",
    title: "Join as a Mentor",
    subtitle: "Guide the next generation of talent.",
    description:
      "Host paid mentorship sessions, review portfolios, and track the impact you create across mentees.",
    ctaLabel: "Continue as Mentor",
    redirectUrl: "/dashboard?role=mentor",
    icon: Users,
  },
  {
    id: "founder",
    title: "Join as a Founder / Recruiter",
    subtitle: "Hire proof‑of‑work talent on demand.",
    description:
      "Post roles, review shortlists, and run a modern hiring funnel designed around real skills.",
    ctaLabel: "Continue as Founder",
    redirectUrl: "/dashboard?role=founder",
    icon: Briefcase,
  },
];

const CareerExplorerRolePage: React.FC = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const handleRoleSelection = (role: RoleConfig) => {
    if (isSignedIn) {
      router.push(role.redirectUrl);
    } else {
      openSignIn({
        forceRedirectUrl: role.redirectUrl,
        appearance: {
          elements: {
            rootBox: "bg-zinc-900",
          },
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-10 md:py-16">
        <div className="w-full max-w-6xl mx-auto space-y-10">
          <section className="text-center space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-zinc-500">
              Career Explorer
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-semibold tracking-tight">
              Choose how you want to use{" "}
              <span className="text-zinc-50">Aureeture</span>
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto">
              One platform, three tailored workspaces. Pick the role that best
              matches how you plan to use the Career Explorer today.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <Card
                  key={role.id}
                  className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-[0_18px_45px_rgba(0,0,0,0.65)] backdrop-blur-md hover:border-zinc-700 transition-colors duration-300"
                >
                  <CardHeader className="space-y-4 pb-4">
                    <div className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 gap-2 w-fit">
                      <Icon className="w-4 h-4" />
                      {role.title.replace("Join as a ", "")}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-zinc-50">
                        {role.title}
                      </CardTitle>
                      <p className="text-sm text-zinc-400 mt-1">
                        {role.subtitle}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {role.description}
                    </p>
                  </CardContent>

                  <CardFooter className="mt-4 flex flex-col gap-2 pt-2">
                    <Button
                      className="w-full rounded-full justify-center bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                      onClick={() => handleRoleSelection(role)}
                    >
                      {isSignedIn
                        ? `Go to ${
                            role.id === "student"
                              ? "Student"
                              : role.id === "mentor"
                              ? "Mentor"
                              : "Founder"
                          } Dashboard`
                        : role.ctaLabel}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {!isSignedIn && (
                      <p className="text-[11px] text-zinc-600 text-center">
                        You&apos;ll be asked to log in or sign up.
                      </p>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CareerExplorerRolePage;

