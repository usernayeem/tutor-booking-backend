import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seed";
import { seedTutor } from "./app/utils/seedTutor";

const bootstrap = async () => {
    try {
        await seedSuperAdmin();
        await seedTutor();
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

bootstrap();
