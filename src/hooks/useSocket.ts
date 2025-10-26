import { useEffect, useRef } from "react";

const useSocket = () => {
	const socketCreated = useRef(false);
	const socketInitializer = async () => {
		try {
			const response = await fetch("/api/socket");
			if (response.ok) {
				console.log("Socket connection initialized");
				socketCreated.current = true;
			} else {
				console.error(
					"Failed to initialize socket:",
					await response.text(),
				);
			}
		} catch (error) {
			console.error("Socket initialization error:", error);
		}
	};

	useEffect(() => {
		if (!socketCreated.current) {
			socketInitializer();
		}
	}, []);
};

export default useSocket;
