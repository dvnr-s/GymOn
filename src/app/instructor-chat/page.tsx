"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Peer, { type MediaConnection } from "peerjs";
import ProtectedRoute from "@/components/auth/protected-route";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Copy,
  Check,
  Wifi,
  WifiOff,
  AlertCircle,
} from "lucide-react";

const PeerPage = () => {
  return (
    <ProtectedRoute>
      <InstructorChatContent />
    </ProtectedRoute>
  );
};

type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "calling"
  | "error";

const InstructorChatContent = () => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);

  const [id, setId] = useState<string>("");
  const [idToCall, setIdToCall] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSupported, setIsSupported] = useState(true);

  // Cross-browser UUID generator
  const generateId = useCallback(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }, []);

  // Check browser support on mount
  useEffect(() => {
    const checkSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSupported(false);
        setError(
          "Your browser doesn't support video calls. Please use Chrome, Firefox, or Safari."
        );
        return false;
      }
      return true;
    };

    if (checkSupport()) {
      setId(generateId());
    }
  }, [generateId]);

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });

      localStreamRef.current = stream;
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to access camera/microphone";
      setError(errorMsg);
      setConnectionStatus("error");
      throw err;
    }
  }, [isVideoEnabled, isAudioEnabled]);

  // Initialize peer connection
  const initializePeer = useCallback(async () => {
    if (!id || peerRef.current) return;

    try {
      setConnectionStatus("connecting");
      setError("");

      const peer = new Peer(id, {
        host: window.location.hostname,
        port: window.location.hostname === "localhost" ? 9000 : 443,
        path: "/myapp",
        secure: window.location.protocol === "https:",
        debug: 2,
      });

      peerRef.current = peer;

      peer.on("open", async () => {
        console.log("Peer connection opened with ID:", id);
        setConnectionStatus("connected");

        try {
          await initializeMedia();
        } catch (err) {
          console.error("Failed to initialize media:", err);
        }
      });

      peer.on("call", async (call) => {
        try {
          setConnectionStatus("calling");
          const stream = localStreamRef.current || (await initializeMedia());

          currentCallRef.current = call;
          call.answer(stream);

          call.on("stream", (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });

          call.on("close", () => {
            endCall();
          });

          call.on("error", (err) => {
            console.error("Call error:", err);
            setError("Call failed: " + err.message);
            endCall();
          });
        } catch (err) {
          console.error("Error answering call:", err);
          setError("Failed to answer call");
          call.close();
        }
      });

      peer.on("disconnected", () => {
        console.log("Peer disconnected");
        setConnectionStatus("disconnected");
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
        setError("Connection error: " + err.message);
        setConnectionStatus("error");
      });
    } catch (err) {
      console.error("Failed to create peer:", err);
      setError("Failed to initialize connection");
      setConnectionStatus("error");
    }
  }, [id, initializeMedia]);

  // Make a call
  const handleCall = useCallback(async () => {
    if (!idToCall.trim()) {
      setError("Please enter a valid ID to call");
      return;
    }

    if (!peerRef.current) {
      setError("Connection not ready. Please wait...");
      return;
    }

    try {
      setConnectionStatus("calling");
      setError("");

      const stream = localStreamRef.current || (await initializeMedia());
      const call = peerRef.current.call(idToCall, stream);

      if (call) {
        currentCallRef.current = call;

        call.on("stream", (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        call.on("close", () => {
          endCall();
        });

        call.on("error", (err) => {
          console.error("Call error:", err);
          setError("Call failed: " + err.message);
          endCall();
        });
      }
    } catch (err) {
      console.error("Error making call:", err);
      setError("Failed to make call");
      setConnectionStatus("connected");
    }
  }, [idToCall, initializeMedia]);

  // End call
  const endCall = useCallback(() => {
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setConnectionStatus("connected");
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  // Toggle microphone
  const toggleMicrophone = useCallback(async () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  // Copy ID to clipboard
  const copyId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy ID:", err);
      setError("Failed to copy ID to clipboard");
    }
  }, [id]);

  // Initialize peer when ID is available
  useEffect(() => {
    if (id && isSupported) {
      initializePeer();
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [id, isSupported, initializePeer]);

  // Connection status badge component
  const getStatusBadge = () => {
    const statusConfig = {
      disconnected: {
        variant: "secondary" as const,
        icon: WifiOff,
        text: "Disconnected",
      },
      connecting: {
        variant: "default" as const,
        icon: Wifi,
        text: "Connecting...",
      },
      connected: { variant: "default" as const, icon: Wifi, text: "Connected" },
      calling: { variant: "default" as const, icon: Phone, text: "In Call" },
      error: {
        variant: "destructive" as const,
        icon: AlertCircle,
        text: "Error",
      },
    };

    const config = statusConfig[connectionStatus];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon size={12} />
        {config.text}
      </Badge>
    );
  };

  if (!isSupported) {
    return (
      <PageWrapper>
        <div className="container mx-auto p-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={24} />
                  Browser Not Supported
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Your browser doesn't support video calls. To use this feature:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Use Chrome, Firefox, or Safari</li>
                  <li>
                    Avoid in-app browsers (like inside WhatsApp, Instagram)
                  </li>
                  <li>For mobile: Open directly in your browser app</li>
                  <li>Allow camera and microphone permissions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Video Call</h1>
          <div className="flex justify-center">{getStatusBadge()}</div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span className="font-medium">Error:</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Local video */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Your Camera</span>
                <div className="flex gap-2">
                  <Button
                    variant={isVideoEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleCamera}
                    disabled={connectionStatus === "disconnected"}
                    className="h-9 w-9 p-0"
                  >
                    {isVideoEnabled ? (
                      <Camera size={18} />
                    ) : (
                      <CameraOff size={18} />
                    )}
                  </Button>
                  <Button
                    variant={isAudioEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleMicrophone}
                    disabled={connectionStatus === "disconnected"}
                    className="h-9 w-9 p-0"
                  >
                    {isAudioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video mb-6 shadow-inner">
                <video
                  className="w-full h-full object-cover scale-x-[-1]"
                  playsInline
                  ref={myVideoRef}
                  autoPlay
                  muted
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <CameraOff
                        size={64}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-gray-400 text-sm">Camera is off</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Your ID
                    </p>
                    <code className="bg-white px-3 py-2 rounded-lg text-blue-800 text-sm font-mono block border border-blue-200 break-all">
                      {id}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyId}
                    disabled={!id}
                    className="shrink-0 h-10 px-4"
                  >
                    {copySuccess ? (
                      <>
                        <Check size={16} className="mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected"
                        ? "bg-green-500"
                        : connectionStatus === "connecting"
                        ? "bg-yellow-500"
                        : connectionStatus === "calling"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span>
                    {connectionStatus === "connected"
                      ? "Ready to make or receive calls"
                      : connectionStatus === "connecting"
                      ? "Establishing connection..."
                      : connectionStatus === "calling"
                      ? "In a call"
                      : connectionStatus === "error"
                      ? "Connection error"
                      : "Disconnected"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remote video */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Remote Camera</span>
                {connectionStatus === "calling" && (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                    Live
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video mb-6 shadow-inner">
                {connectionStatus === "calling" ? (
                  <video
                    className="w-full h-full object-cover scale-x-[-1]"
                    playsInline
                    ref={remoteVideoRef}
                    autoPlay
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {connectionStatus === "connected" ? (
                        <>
                          <Phone
                            size={64}
                            className="text-gray-400 mx-auto mb-3"
                          />
                          <p className="text-gray-500 font-medium">
                            Waiting for call...
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Share your ID to receive calls
                          </p>
                        </>
                      ) : (
                        <>
                          <WifiOff
                            size={64}
                            className="text-gray-400 mx-auto mb-3"
                          />
                          <p className="text-gray-500 font-medium">
                            No connection
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Establishing connection...
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {connectionStatus === "calling" ? (
                  <Button
                    onClick={endCall}
                    variant="destructive"
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                  >
                    <PhoneOff size={20} className="mr-3" />
                    End Call
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Enter ID to call
                      </label>
                      <input
                        className="w-full border border-gray-300 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                        placeholder="Paste the ID here..."
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                        disabled={connectionStatus !== "connected"}
                      />
                    </div>
                    <Button
                      onClick={handleCall}
                      disabled={
                        !idToCall.trim() || connectionStatus !== "connected"
                      }
                      className="w-full h-12 text-base font-medium"
                      size="lg"
                    >
                      <Phone size={20} className="mr-3" />
                      {connectionStatus !== "connected"
                        ? "Connecting..."
                        : "Start Call"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  How to use Video Call
                </h3>
                <div className="text-sm text-blue-700 space-y-2 max-w-2xl mx-auto">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-left">
                      Copy your ID and share it with the person you want to call
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-left">
                      Or ask them to share their ID and paste it in the "Enter
                      ID to call" field
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-left">
                      Click "Start Call" to begin your video consultation
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-blue-600 pt-2 border-t border-blue-200">
                <div className="flex items-center gap-2">
                  <Camera size={16} />
                  <span>HD Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic size={16} />
                  <span>Clear Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi size={16} />
                  <span>Secure Connection</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default PeerPage;
