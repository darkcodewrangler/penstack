import { v2 as cloudinary } from "cloudinary";
import { UrlUploadProps } from "../types";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateSignature = (folder: string, timestamp: number) => {
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!
  );
  return signature;
};

export const uploadFromUrl = async ({
  url,
  folder = "uploads",
  filename,
}: UrlUploadProps) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(url, {
      folder,
      ...(filename && { public_id: filename }),
    });
    return uploadResult;
  } catch (error) {
    throw new Error("Failed to upload file from URL");
  }
};
