"use client";
import { useState, useEffect, useRef } from "react";
import Peer, { type MediaConnection } from "peerjs";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";

const PeerPage = () => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);

  const currentCallRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [id, setId] = useState<string>("");
  const [idToCall, setIdToCall] = useState("");
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const generateId = () => crypto.randomUUID();

  const handleCall = () => {
    if (!idToCall.trim()) {
      alert("Please enter a valid ID to call.");
      return;
    }

    setIsCalling(true);
    navigator.mediaDevices
      .getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      })
      .then((stream) => {
        localStreamRef.current = stream;
        const call = peerInstance?.call(idToCall, stream);
        if (call) {
          currentCallRef.current = call;
          call.on("stream", (userVideoStream) => {
            if (callingVideoRef.current) {
              callingVideoRef.current.srcObject = userVideoStream;
            }
          });

          call.on("close", () => {
            endCall();
          });
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        setIsCalling(false);
      });
  };

  const endCall = () => {
    // Close the current call if it exists
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }

    // Clear the remote video
    if (callingVideoRef.current) {
      callingVideoRef.current.srcObject = null;
    }

    setIsCalling(false);
  };

  const copyId = () => {
    navigator.clipboard.writeText(id);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  useEffect(() => {
    if (id) {
      let peer: Peer;
      if (typeof window !== "undefined") {
        peer = new Peer(id, {
          host: "localhost",
          port: 9000,
          path: "/myapp",
        });

        setPeerInstance(peer);

        navigator.mediaDevices
          .getUserMedia({
            video: isVideoEnabled,
            audio: isAudioEnabled,
          })
          .then((stream) => {
            localStreamRef.current = stream;
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream;
            }

            peer.on("call", (call) => {
              currentCallRef.current = call;
              call.answer(stream);
              setIsCalling(true);

              call.on("stream", (userVideoStream) => {
                if (callingVideoRef.current) {
                  callingVideoRef.current.srcObject = userVideoStream;
                }
              });

              call.on("close", () => {
                endCall();
              });
            });
          });

        peer.on("disconnected", () => {
          endCall();
        });

        peer.on("error", () => {
          endCall();
        });
      }
      return () => {
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, [id]);

  useEffect(() => {
    setId(generateId);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
          Instructor Chat
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Your video */}
          <div className="flex-1 bg-card rounded-xl shadow-md p-6 flex flex-col border">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-card-foreground">
                Your Camera
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={toggleCamera}
                  className={`p-2 rounded-lg transition-all ${
                    isVideoEnabled
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {isVideoEnabled ? (
                    <Camera size={18} />
                  ) : (
                    <CameraOff size={18} />
                  )}
                </button>
                <button
                  onClick={toggleMicrophone}
                  className={`p-2 rounded-lg transition-all ${
                    isAudioEnabled
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {isAudioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden bg-muted aspect-video mb-4">
              <video
                className="w-full h-full object-cover scale-x-[-1]"
                playsInline
                ref={myVideoRef}
                autoPlay
                muted
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <CameraOff
                      size={32}
                      className="text-muted-foreground mx-auto mb-2"
                    />
                    <p className="text-muted-foreground text-sm">
                      Camera is off
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
              <span className="text-sm text-muted-foreground">Your ID: </span>
              <code className="bg-background px-2 py-1 rounded flex-1 text-foreground text-sm font-mono overflow-hidden text-ellipsis border">
                {id}
              </code>
              <button
                onClick={copyId}
                className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground py-1 px-2 rounded transition-all"
              >
                {copySuccess ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Remote video */}
          <div className="flex-1 bg-card rounded-xl shadow-md p-6 flex flex-col border">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              Remote Camera
            </h2>

            <div className="relative rounded-lg overflow-hidden bg-muted aspect-video mb-4">
              {isCalling ? (
                <video
                  className="w-full h-full object-cover scale-x-[-1]"
                  playsInline
                  ref={callingVideoRef}
                  autoPlay
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  No connection
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              {isCalling ? (
                <button
                  onClick={endCall}
                  className="w-full px-4 py-2 rounded-lg font-medium bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all"
                >
                  End Call
                </button>
              ) : (
                <>
                  <input
                    className="flex-1 border bg-background text-foreground rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="ID to call"
                    value={idToCall}
                    onChange={(e) => setIdToCall(e.target.value)}
                  />
                  <button
                    onClick={handleCall}
                    disabled={!idToCall}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                  >
                    Call
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          Share your ID with the person you want to connect with
        </p>
      </div>
    </div>
  );
};

export default PeerPage;
