import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary connection...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    
    // Test by fetching account details
    const result = await cloudinary.api.ping();
    console.log('✓ Cloudinary connection successful!');
    console.log('Status:', result.status);
    
  } catch (error) {
    console.error('✗ Cloudinary connection failed:', error.message);
  }
}

testCloudinary();