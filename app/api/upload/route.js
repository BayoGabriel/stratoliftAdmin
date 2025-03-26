import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { image } = req.body;
    const uploadedResponse = await cloudinary.v2.uploader.upload(image, {
      folder: "uploads", // You can change this
    });

    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
}
