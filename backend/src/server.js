require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./database/connect");

const PORT = process.env.PORT || 5000;

async function bootstrap() {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
}

bootstrap();