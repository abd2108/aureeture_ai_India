// @ts-nocheck


"use client";

import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import {
  Loader2,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  AlertCircle,
  Square,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

interface SessionCredentials {
  sessionId: string;
  channelName: string;
  agoraToken: string;
  uid: string;
  role: "mentor" | "mentee";
  recordingEnabled: boolean;
  agoraAppId: string;
}

const JoinSessionPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [credentials, setCredentials] = useState<SessionCredentials | null>(null);
  
  // Agora state
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [recording, setRecording] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  // Refs for Agora
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoContainerRef = useRef<HTMLDivElement>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const useMockData = !apiBase || process.env.NEXT_PUBLIC_USE_MOCK_SESSIONS === "true";

  // Initialize and join Agora channel
  const joinAgoraChannel = async (creds: SessionCredentials) => {
    try {
      setJoining(true);

      // Create Agora client
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // Set up event handlers
      client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
        await client.subscribe(user, mediaType);
        console.log("User published:", user.uid, mediaType);

        if (mediaType === "video") {
          setRemoteUsers((prev) => {
            if (prev.find((u) => u.uid === user.uid)) return prev;
            return [...prev, user];
          });
        }

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
        console.log("User unpublished:", user.uid, mediaType);
        if (mediaType === "video") {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
      });

      client.on("user-left", (user: IAgoraRTCRemoteUser) => {
        console.log("User left:", user.uid);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      // Join channel
      const numericUid = parseInt(creds.uid.replace(/\D/g, ""), 10) || 0;
      await client.join(creds.agoraAppId, creds.channelName, creds.agoraToken, numericUid);

      // Create and publish local tracks (only if mentor or if mentee has permission)
      if (creds.role === "mentor") {
        // Create audio track
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localAudioTrackRef.current = audioTrack;
        audioTrack.setEnabled(micEnabled);

        // Create video track
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        localVideoTrackRef.current = videoTrack;
        videoTrack.setEnabled(videoEnabled);

        // Play local video
        if (localVideoContainerRef.current) {
          videoTrack.play(localVideoContainerRef.current);
        }

        // Publish tracks
        await client.publish([audioTrack, videoTrack]);
      }

      setJoined(true);
      setJoining(false);
    } catch (err: any) {
      console.error("Error joining Agora channel:", err);
      setError(err.message || "Failed to join video session. Please try again.");
      setJoining(false);
    }
  };

  // Fetch session credentials and join
  useEffect(() => {
    // Mock mode: skip all network calls and mark joined
    if (useMockData) {
      setCredentials({
        sessionId: sessionId || "mock-session",
        channelName: "mock-channel",
        agoraToken: "mock-token",
        uid: (user?.id as string) || "mock-user",
        role: "mentor",
        recordingEnabled: true,
        agoraAppId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "mock-app-id",
      });
      setJoined(true);
      setLoading(false);
      return;
    }

    if (!isLoaded || !isSignedIn || !user?.id || !sessionId) {
      setError("Please sign in to join the session.");
      setLoading(false);
      return;
    }

    const fetchAndJoin = async () => {
      setLoading(true);
      setError(null);

      try {
        // First verify join eligibility
        const verifyRes = await fetch(
          `${apiBase}/api/mentor-sessions/${sessionId}/verify-join?mentorId=${encodeURIComponent(user.id)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!verifyRes.ok) {
          let errorMessage = "Cannot join session";
          try {
            const errorData = await verifyRes.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // If JSON parsing fails, use status text
            errorMessage = verifyRes.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        // Get Agora credentials
        const joinRes = await fetch(`${apiBase}/api/session/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sessionId,
            userId: user.id,
          }),
        });

        if (!joinRes.ok) {
          let errorMessage = "Failed to join session";
          try {
            const errorData = await joinRes.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = joinRes.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const creds = (await joinRes.json()) as SessionCredentials;
        setCredentials(creds);

        // Join Agora channel
        await joinAgoraChannel(creds);
      } catch (err: any) {
        console.error("Error joining session:", err);
        const errorMessage = err.message || "Failed to join session. Please check your connection and try again.";
        setError(errorMessage);
        // Log detailed error for debugging
        if (err.message?.includes("fetch")) {
          console.error("Network error - check if backend is running at:", apiBase);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndJoin();
  }, [isLoaded, isSignedIn, user?.id, sessionId, apiBase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const leaveChannel = async () => {
        if (clientRef.current) {
          try {
            // Unpublish tracks
            if (localVideoTrackRef.current) {
              localVideoTrackRef.current.close();
              localVideoTrackRef.current = null;
            }
            if (localAudioTrackRef.current) {
              localAudioTrackRef.current.close();
              localAudioTrackRef.current = null;
            }

            // Leave channel
            await clientRef.current.leave();
            clientRef.current = null;
          } catch (err) {
            console.error("Error leaving channel:", err);
          }
        }
      };

      leaveChannel();
    };
  }, []);

  // Toggle microphone
  const toggleMic = async () => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(!micEnabled);
      setMicEnabled(!micEnabled);
    }
  };

  // Toggle camera
  const toggleVideo = async () => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  };

  // Start/stop recording (mentor only)
  const toggleRecording = async () => {
    if (!credentials?.recordingEnabled) return;

    try {
      // TODO: Implement recording start/stop API calls
      // For now, just toggle UI state
      setRecording(!recording);
      
      // In production, you would call:
      // POST /api/session/recording/start or /api/session/recording/stop
    } catch (err) {
      console.error("Error toggling recording:", err);
    }
  };

  // Leave session
  const handleLeaveSession = async () => {
    try {
      // Unpublish and leave
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }

      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }

      // Mark session as completed if mentor
      if (credentials?.role === "mentor" && sessionId && apiBase && user?.id) {
        await fetch(
          `${apiBase}/api/mentor-sessions/${sessionId}/complete?mentorId=${encodeURIComponent(user.id)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
      }
    } catch (err) {
      console.error("Error leaving session:", err);
    } finally {
      // Navigate back to session details
      router.push(`/dashboard/mentor/sessions/${sessionId}`);
    }
  };

  // Render remote video streams
  useEffect(() => {
    if (!remoteVideoContainerRef.current || remoteUsers.length === 0) return;

    const container = remoteVideoContainerRef.current;
    container.innerHTML = ""; // Clear previous

    remoteUsers.forEach((user) => {
      if (user.videoTrack) {
        const videoElement = document.createElement("div");
        videoElement.id = `remote-${user.uid}`;
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        container.appendChild(videoElement);
        user.videoTrack.play(videoElement);
      }
    });
  }, [remoteUsers]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-zinc-100">Access Denied</h1>
          <p className="text-sm text-zinc-400">Please sign in to join the session.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
          <p className="text-sm text-zinc-400">Joining session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 p-6">
        <Card className="max-w-md w-full border-red-200 dark:border-red-900/40">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  Cannot Join Session
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  {error}
                </p>
                <Button
                  onClick={() => router.push(`/dashboard/mentor/sessions/${sessionId}`)}
                  className="w-full"
                >
                  Back to Session Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative bg-zinc-900 overflow-hidden">
        {/* Remote Video Grid */}
        <div
          ref={remoteVideoContainerRef}
          className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2 p-2"
        />

        {/* Local Video (Mentor) - Bottom Right Corner */}
        {credentials?.role === "mentor" && joined && (
          <div className="absolute bottom-20 right-4 w-48 h-36 bg-zinc-800 rounded-lg overflow-hidden border-2 border-indigo-500">
            <div ref={localVideoContainerRef} className="w-full h-full" />
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                <VideoOff className="h-8 w-8 text-zinc-600" />
              </div>
            )}
          </div>
        )}

        {/* Joining Overlay */}
        {joining && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-50">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
              <p className="text-sm text-zinc-400">Connecting to video session...</p>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-40">
          <Button
            variant={micEnabled ? "default" : "destructive"}
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={toggleMic}
            disabled={!joined || credentials?.role !== "mentor"}
          >
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            variant={videoEnabled ? "default" : "destructive"}
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={toggleVideo}
            disabled={!joined || credentials?.role !== "mentor"}
          >
            {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          {/* Recording Button (Mentor Only) */}
          {credentials?.recordingEnabled && (
            <Button
              variant={recording ? "destructive" : "default"}
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={toggleRecording}
              disabled={!joined}
            >
              {recording ? (
                <Square className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5 fill-current" />
              )}
            </Button>
          )}

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={handleLeaveSession}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Session Info Bar */}
      <div className="h-16 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between px-6">
        <div className="text-sm text-zinc-400">
          {credentials?.role === "mentor" ? "Mentor" : "Mentee"} • Channel: {credentials?.channelName}
          {recording && (
            <span className="ml-3 inline-flex items-center gap-1 text-red-400">
              <Circle className="h-2 w-2 fill-current animate-pulse" />
              Recording
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLeaveSession}
          className="text-zinc-400 hover:text-zinc-100"
        >
          Leave Session
        </Button>
      </div>
    </div>
  );
};

export default JoinSessionPage;
