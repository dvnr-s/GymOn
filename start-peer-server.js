const { PeerServer } = require("peer");

// Create PeerJS server
const peerServer = PeerServer({
  port: 9000,
  path: "/myapp",
  debug: true,
  allow_discovery: true,
});

console.log("🎥 PeerJS Server started on port 9000");
console.log("📡 Server path: /myapp");
console.log("🔗 Connect at: ws://localhost:9000/myapp");

peerServer.on("connection", (client) => {
  console.log(`👤 Client connected: ${client.getId()}`);
});

peerServer.on("disconnect", (client) => {
  console.log(`👋 Client disconnected: ${client.getId()}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down PeerJS server...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down PeerJS server...");
  process.exit(0);
});
