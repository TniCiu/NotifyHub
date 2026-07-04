require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
});

module.exports = server;
