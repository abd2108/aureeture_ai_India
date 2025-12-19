"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const roles = [
  {
    id: "student",
    title: "Student / Job Seeker",
    description: "Discover your path, build proof-of-work, and track every step in your career dashboard.",
    href: "/dashboard?role=student",
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Host paid sessions, guide mentees, and track your mentorship impact.",
    href: "/dashboard?role=mentor",
  },
  {
    id: "founder",
    title: "Founder / Recruiter",
    description: "Discover proof-of-work talent, manage pipelines, and hire with confidence.",
    href: "/dashboard?role=founder",
  },
];

export default function SelectRolePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500">
            Aureeture
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Choose how you want to use Career Explorer
          </h1>
          <p className="text-sm md:text-base text-zinc-500 max-w-2xl mx-auto">
            One login, three tailored workspaces. Select your primary role for this session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="flex flex-col justify-between border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm"
            >
              <CardHeader>
                <CardTitle className="text-base md:text-lg">{role.title}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full rounded-full">
                  <Link href={role.href}>Continue as {role.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


