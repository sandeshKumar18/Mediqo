import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

console.log("Cloud:", process.env.CLOUDINARY_NAME);
console.log("Key exists:", !!process.env.CLOUDINARY_API_KEY);
console.log("Secret exists:", !!process.env.CLOUDINARY_SECRET_KEY);

try {
  const result = await cloudinary.uploader.upload(
    "C:\\Users\\Lenovo\\AppData\\Local\\Temp\\Black_Shirt.jpeg",
    {
      resource_type: "image",
    }
  );

  console.log("SUCCESS");
  console.log("URL:", result.secure_url);

} catch (error) {
  console.log("FAILED");
  console.dir(error, { depth: null });
}