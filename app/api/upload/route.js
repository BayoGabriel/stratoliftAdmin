import cloudinary from '@/lib/cloudinary';
import formidable from 'formidable';
import fs from 'fs';

// Disable default body parser in the new Next.js app directory API route config
export const GET = {
  body: false, // Disable body parser
};

// Helper function to parse the form and upload file to Cloudinary
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = './public/uploads'; // Temporary local upload directory

    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);

      const file = files.file.path;

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
          folder: 'nextjs_uploads', // Folder in Cloudinary to store the images
        });

        // Clean up the uploaded file
        fs.unlinkSync(file);

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });

// Handle POST requests
export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const image = await parseForm(req);
    return new Response(JSON.stringify(image), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
