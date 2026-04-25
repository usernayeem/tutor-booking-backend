import app from "./app.js";
import { envVars } from "./app/config/env.js";

const bootstrap = async () => {
    try {
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

bootstrap();
