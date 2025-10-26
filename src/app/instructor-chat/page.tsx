"use client";
import { useState, useEffect, useRef } from "react";
import Peer, { type MediaConnection } from "peerjs";

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

	const generateId = () => crypto.randomUUID();

	const handleCall = () => {
		if (!idToCall.trim()) {
			alert("Please enter a valid ID to call.");
			return;
		}

		setIsCalling(true);
		navigator.mediaDevices
			.getUserMedia({
				video: true,
				audio: true,
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
						video: true,
						audio: true,
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
					localStreamRef.current
						.getTracks()
						.forEach((track) => track.stop());
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
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
					Instructor Chat
				</h1>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Your video */}
					<div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col">
						<h2 className="text-xl font-semibold text-gray-800 mb-2">
							Your Camera
						</h2>

						<div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video mb-4">
							<video
								className="w-full h-full object-cover scale-x-[-1]"
								playsInline
								ref={myVideoRef}
								autoPlay
								muted
							/>
						</div>

						<div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4">
							<span className="text-sm text-gray-600">Your ID: </span>
							<code className="bg-white px-2 py-1 rounded flex-1 text-blue-800 text-sm font-mono overflow-hidden text-ellipsis">
								{id}
							</code>
							<button
								onClick={copyId}
								className="text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded transition-all"
							>
								{copySuccess ? "Copied!" : "Copy"}
							</button>
						</div>
					</div>

					{/* Remote video */}
					<div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col">
						<h2 className="text-xl font-semibold text-gray-800 mb-2">
							Remote Camera
						</h2>

						<div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video mb-4">
							{isCalling ? (
								<video
									className="w-full h-full object-cover scale-x-[-1]"
									playsInline
									ref={callingVideoRef}
									autoPlay
								/>
							) : (
								<div className="absolute inset-0 flex items-center justify-center text-gray-500">
									No connection
								</div>
							)}
						</div>

						<div className="flex gap-2 mt-2">
							{isCalling ? (
								<button
									onClick={endCall}
									className="w-full px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-all"
								>
									End Call
								</button>
							) : (
								<>
									<input
										className="flex-1 border border-gray-300 text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="ID to call"
										value={idToCall}
										onChange={(e) => setIdToCall(e.target.value)}
									/>
									<button
										onClick={handleCall}
										disabled={!idToCall}
										className="px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
									>
										Call
									</button>
								</>
							)}
						</div>
					</div>
				</div>

				<p className="text-center text-gray-500 text-sm mt-8">
					Share your ID with the person you want to connect with
				</p>
			</div>
		</div>
	);
};

export default PeerPage;
