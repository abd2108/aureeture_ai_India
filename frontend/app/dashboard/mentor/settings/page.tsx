"use client";

import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ChannelPrefs = {
  email: boolean;
  sms: boolean;
};

type OpportunityPrefs = {
  fullTime: boolean;
  partTime: boolean;
  referral: boolean;
};

type GeneralPrefs = {
  jobs: boolean;
  updates: boolean;
  unsubscribeAll: boolean;
};

type SecurityPrefs = {
  loginAlerts: boolean;
  twoFactor: boolean;
};

type PrivacyPrefs = {
  publicDirectory: boolean;
  showCalendarPreview: boolean;
};

const MentorSettingsPage: React.FC = () => {
  const { profile, updateProfile } = useProfile();

  // Profile state
  const [name, setName] = useState(profile.name || "");
  const [headline, setHeadline] = useState(profile.jobTitle || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [profileSaved, setProfileSaved] = useState(false);

  // Availability state
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [acceptInstantBookings, setAcceptInstantBookings] =
    useState<boolean>(true);

  // Communications state
  const [channels, setChannels] = useState<ChannelPrefs>({
    email: true,
    sms: true,
  });
  const [opportunities, setOpportunities] = useState<OpportunityPrefs>({
    fullTime: true,
    partTime: true,
    referral: true,
  });
  const [general, setGeneral] = useState<GeneralPrefs>({
    jobs: true,
    updates: true,
    unsubscribeAll: false,
  });
  const [security, setSecurity] = useState<SecurityPrefs>({
    loginAlerts: true,
    twoFactor: false,
  });
  const [privacy, setPrivacy] = useState<PrivacyPrefs>({
    publicDirectory: true,
    showCalendarPreview: true,
  });

  const [dangerModalOpen, setDangerModalOpen] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({ name, jobTitle: headline, bio });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 1500);
  };

  return (
    <div className="mx-auto space-y-8 rounded-3xl bg-transparent pb-8 pt-2 md:pt-4 lg:max-w-5xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Mentor settings
        </h1>
        <p className="text-sm text-zinc-500">
          Fine‑tune how Aureeture communicates with you and how your mentor
          account behaves.
        </p>
      </div>

      <Tabs defaultValue="communications" className="space-y-5">
        <TabsList className="inline-flex justify-start overflow-x-auto rounded-full bg-zinc-100/90 px-1 py-1 text-sm dark:bg-zinc-900/90">
          <TabsTrigger value="communications" className="rounded-full px-4 py-1.5">
            Communications
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-full px-4 py-1.5">
            Account
          </TabsTrigger>
        </TabsList>

        {/* Communications tab – mirrors Mercor-style layout */}
        <TabsContent value="communications">
          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardHeader>
              <CardTitle className="text-base">Communications</CardTitle>
              <CardDescription>
                Choose how and where you&apos;d like to receive updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Communication channels */}
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Communication channels
                </p>
                <div className="space-y-3">
                  <PreferenceRow
                    title="Email"
                    description="Receive updates and notifications over email."
                    checked={channels.email}
                    onChange={(value) =>
                      setChannels((prev) => ({ ...prev, email: value }))
                    }
                  />
                  <PreferenceRow
                    title="Text message (SMS)"
                    description="Important updates about interviews and offers."
                    checked={channels.sms}
                    onChange={(value) =>
                      setChannels((prev) => ({ ...prev, sms: value }))
                    }
                  />
                </div>
              </section>

              {/* Opportunity types */}
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Opportunity types
                </p>
                <div className="space-y-3">
                  <PreferenceRow
                    title="Full-time opportunities"
                    description="Contact me about full‑time mentoring or advisory roles."
                    checked={opportunities.fullTime}
                    onChange={(value) =>
                      setOpportunities((prev) => ({ ...prev, fullTime: value }))
                    }
                  />
                  <PreferenceRow
                    title="Part-time opportunities"
                    description="Contact me about part‑time or fractional engagements."
                    checked={opportunities.partTime}
                    onChange={(value) =>
                      setOpportunities((prev) => ({ ...prev, partTime: value }))
                    }
                  />
                  <PreferenceRow
                    title="Referral opportunities"
                    description="Contact me about referral or partner programs."
                    checked={opportunities.referral}
                    onChange={(value) =>
                      setOpportunities((prev) => ({ ...prev, referral: value }))
                    }
                  />
                </div>
              </section>

              {/* General */}
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  General
                </p>
                <div className="space-y-3">
                  <PreferenceRow
                    title="Job opportunities"
                    description="Receive notifications about new job openings, interviews, and application invitations."
                    checked={general.jobs}
                    onChange={(value) =>
                      setGeneral((prev) => ({ ...prev, jobs: value }))
                    }
                  />
                  <PreferenceRow
                    title="Work‑related updates"
                    description="Get updates about offers, work trials, contracts, and project status changes."
                    checked={general.updates}
                    onChange={(value) =>
                      setGeneral((prev) => ({ ...prev, updates: value }))
                    }
                  />
                  <PreferenceRow
                    title="Unsubscribe from all"
                    description="Turn this on to stop all Aureeture outreach."
                    checked={general.unsubscribeAll}
                    onChange={(value) =>
                      setGeneral((prev) => ({
                        ...prev,
                        unsubscribeAll: value,
                        // If turned on, automatically disable other toggles.
                        jobs: value ? false : prev.jobs,
                        updates: value ? false : prev.updates,
                      }))
                    }
                  />
                </div>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account tab */}
        <TabsContent value="account">
          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardHeader>
              <CardTitle className="text-base">Account & security</CardTitle>
              <CardDescription>
                High‑level preferences for your mentor account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Email
                </p>
                <Input value={profile.email || "user@example.com"} disabled />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Notifications
                </p>
                <PreferenceRow
                  title="Email alerts for new bookings"
                  description="Get an email when a student books or reschedules a session."
                  checked={channels.email}
                  onChange={(value) =>
                    setChannels((prev) => ({ ...prev, email: value }))
                  }
                />
                <PreferenceRow
                  title="SMS reminders"
                  description="Receive SMS reminders 30 minutes before a session starts."
                  checked={channels.sms}
                  onChange={(value) =>
                    setChannels((prev) => ({ ...prev, sms: value }))
                  }
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Security
                </p>
                <PreferenceRow
                  title="Login alerts"
                  description="Email me when my mentor account is accessed from a new browser or device."
                  checked={security.loginAlerts}
                  onChange={(value) =>
                    setSecurity((prev) => ({ ...prev, loginAlerts: value }))
                  }
                />
                <PreferenceRow
                  title="Require 2‑step verification"
                  description="Ask for an additional verification step when logging in from untrusted devices."
                  checked={security.twoFactor}
                  onChange={(value) =>
                    setSecurity((prev) => ({ ...prev, twoFactor: value }))
                  }
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Data &amp; privacy
                </p>
                <PreferenceRow
                  title="Appear in mentor directory"
                  description="Allow students to discover your profile in Aureeture’s public mentor listings."
                  checked={privacy.publicDirectory}
                  onChange={(value) =>
                    setPrivacy((prev) => ({ ...prev, publicDirectory: value }))
                  }
                />
                <PreferenceRow
                  title="Show calendar preview"
                  description="Let students see a preview of your available days before they start a booking."
                  checked={privacy.showCalendarPreview}
                  onChange={(value) =>
                    setPrivacy((prev) => ({
                      ...prev,
                      showCalendarPreview: value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                <p className="text-xs font-semibold uppercase tracking-wide">
                  Danger zone
                </p>
                <p className="text-xs">
                  Deactivating your mentor account hides your profile from
                  students and pauses all new bookings. Existing payouts will
                  still be processed.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-1 w-fit"
                  type="button"
                  onClick={() => setDangerModalOpen(true)}
                >
                  Deactivate mentor account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deactivate account explanation */}
      <Dialog open={dangerModalOpen} onOpenChange={setDangerModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Account deactivation coming soon</DialogTitle>
            <DialogDescription className="space-y-2 text-sm text-zinc-500">
              <p>
                You&apos;ll soon be able to deactivate your mentor account from
                here. For now, please reach out to the Aureeture support team if
                you need to temporarily or permanently pause mentoring.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PreferenceRow = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <button
    type="button"
    className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 text-left text-xs shadow-[0_1px_0_rgba(15,23,42,0.03)] transition-colors hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-900"
    onClick={() => onChange(!checked)}
  >
    <div className="max-w-xl">
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {title}
      </p>
      <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className="shrink-0"
    />
  </button>
);

export default MentorSettingsPage;



