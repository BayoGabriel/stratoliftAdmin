"use client";
import { useState } from "react";

export default function CreateTask() {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    location: "",
    type: "service",
    priority: "medium",
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setTaskData({ ...taskData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    // Upload images to Cloudinary (or your preferred storage)
    const uploadedImages = [];
    for (const file of taskData.images) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_cloudinary_preset");

      const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      uploadedImages.push({ url: data.secure_url, name: file.name, type: file.type });
    }

    // Send task data to the backend
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...taskData, attachments: uploadedImages }),
    });

    const result = await response.json();
    setUploading(false);
    
    if (result.success) {
      alert("Task created successfully!");
    } else {
      alert("Error creating task: " + result.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Task</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" required onChange={handleChange} className="w-full p-2 mb-3 border rounded"/>
        <textarea name="description" placeholder="Description" required onChange={handleChange} className="w-full p-2 mb-3 border rounded"></textarea>
        <input type="text" name="location" placeholder="Location" required onChange={handleChange} className="w-full p-2 mb-3 border rounded"/>
        <select name="type" onChange={handleChange} className="w-full p-2 mb-3 border rounded">
          <option value="service">Service</option>
          <option value="sos">SOS</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select name="priority" onChange={handleChange} className="w-full p-2 mb-3 border rounded">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <input type="file" multiple onChange={handleFileChange} className="w-full p-2 mb-3 border rounded"/>
        <button type="submit" disabled={uploading} className="w-full p-2 bg-blue-500 text-white rounded">
          {uploading ? "Uploading..." : "Submit Task"}
        </button>
      </form>
    </div>
  );
}
