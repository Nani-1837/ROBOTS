import { InsForgeClient } from '@insforge/sdk';
import dotenv from 'dotenv';

dotenv.config();

const insforge = new InsForgeClient({
    projectId: process.env.INSFORGE_PROJECT_ID,
    apiKey: process.env.INSFORGE_API_KEY,
    baseUrl: process.env.INSFORGE_BASE_URL
});

export default insforge;
