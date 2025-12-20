"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FounderPostJobPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Post a Role</h1>
        <p className="text-sm text-zinc-500">
          Create a new opportunity for Aureeture&apos;s proof-of-work talent. This
          is a stub form you can later connect to your backend.
        </p>
      </div>

      <div className="space-y-4">
        <Input placeholder="Job title (e.g. Founding Frontend Engineer)" />
        <Input placeholder="Company" />
        <Input placeholder="Location (e.g. Remote, Bengaluru)" />
        <Textarea placeholder="Short description, responsibilities, and requirements" />
        <Button className="w-full md:w-auto">Publish Job</Button>
      </div>
    </div>
  );
}


