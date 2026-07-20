import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

async function testUpload() {
  try {
    console.log("Cloudinary Upload Starting...");
    const result = await cloudinary.uploader.upload('./test.jpg');
    console.log("Upload Successful ✅");
    console.log(result.secure_url);
  } catch (err) {
    console.error("Upload Failed ❌", err);
  }
}

testUpload();
