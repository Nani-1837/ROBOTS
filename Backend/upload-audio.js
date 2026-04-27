import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const audioFiles = [
  { name: 'click_sound', url: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' },
  { name: 'hover_sound', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' }
];

async function uploadAudio() {
  const results = {};
  for (const audio of audioFiles) {
    try {
      const result = await cloudinary.uploader.upload(audio.url, {
        folder: 'bisonix_assets/audio',
        public_id: audio.name,
        resource_type: 'video' // Cloudinary handles audio as 'video' resource type
      });
      results[audio.name] = result.secure_url;
      console.log(`✅ Uploaded ${audio.name}`);
    } catch (error) {
      console.error(`❌ Failed ${audio.name}:`, error.message);
    }
  }
  console.log(JSON.stringify(results, null, 2));
}
uploadAudio();
