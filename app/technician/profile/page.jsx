"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [originalUser, setOriginalUser] = useState(null)
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: "",
    school: "",
    role: "",
    status: "",
  })
  const [changedFields, setChangedFields] = useState({})
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        setUser(data)
        setOriginalUser(data)
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load profile data",
        })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
    }

    fetchUserProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))

    // Track changed fields by comparing with original values
    if (originalUser && value !== originalUser[name]) {
      setChangedFields((prev) => ({ ...prev, [name]: true }))
    } else {
      // If value is back to original, remove from changed fields
      const updatedChangedFields = { ...changedFields }
      delete updatedChangedFields[name]
      setChangedFields(updatedChangedFields)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setImageLoading(true)
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Image upload failed")

      const data = await response.json()
      setUser((prev) => ({ ...prev, image: data.url }))
      setChangedFields((prev) => ({ ...prev, image: true }))

      setMessage({
        type: "success",
        text: "Image uploaded successfully",
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to upload image",
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } finally {
      setImageLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // If no fields have changed, show message and return
    if (Object.keys(changedFields).length === 0) {
      setMessage({
        type: "info",
        text: "No changes to save",
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      return
    }

    setLoading(true)

    // Only send changed fields to the API
    const updatedData = {}
    Object.keys(changedFields).forEach((field) => {
      updatedData[field] = user[field]
    })

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      const data = await response.json()

      // Update original user data with the new values
      setOriginalUser({ ...originalUser, ...updatedData })
      // Clear changed fields
      setChangedFields({})

      setMessage({
        type: "success",
        text: "Profile updated successfully",
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)

      router.refresh()
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update profile",
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = Object.keys(changedFields).length > 0

  return (
    <div className="container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">Profile Settings</h1>
          <p className="profile-description">View and update your personal information</p>
        </div>

        {message.text && (
          <div
            className={`alert ${
              message.type === "error" ? "alert-error" : message.type === "info" ? "alert-info" : "alert-success"
            }`}
          >
            {message.text}
          </div>
        )}

        {hasChanges && (
          <div className="changes-banner">
            <p>You have unsaved changes</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="profile-content">
            <div className="image-upload-container">
              <div className="profile-image-container">
                {user.image ? (
                  <Image
                    src={user.image || "/placeholder.svg"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-image-placeholder">
                    <span>{user.name?.charAt(0) || "U"}</span>
                  </div>
                )}
                {imageLoading && (
                  <div className="image-loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
              <div className="image-upload-button-container">
                <label htmlFor="image-upload" className="image-upload-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>Change Image</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden-input"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
                {changedFields.name && <span className="field-changed">Changed</span>}
              </label>
              <input
                id="name"
                name="name"
                className={`form-input ${changedFields.name ? "input-changed" : ""}`}
                value={user.name || ""}
                onChange={handleChange}
                placeholder="Your full name"
              />
              {originalUser && changedFields.name && (
                <div className="original-value">Original: {originalUser.name || "None"}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
                {changedFields.email && <span className="field-changed">Changed</span>}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${changedFields.email ? "input-changed" : ""}`}
                value={user.email || ""}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
              {originalUser && changedFields.email && (
                <div className="original-value">Original: {originalUser.email || "None"}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="school" className="form-label">
                School
                {changedFields.school && <span className="field-changed">Changed</span>}
              </label>
              <input
                id="school"
                name="school"
                className={`form-input ${changedFields.school ? "input-changed" : ""}`}
                value={user.school || ""}
                onChange={handleChange}
                placeholder="Your school"
              />
              {originalUser && changedFields.school && (
                <div className="original-value">Original: {originalUser.school || "None"}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Role
                  {changedFields.role && <span className="field-changed">Changed</span>}
                </label>
                <select
                  id="role"
                  name="role"
                  className={`form-select ${changedFields.role ? "input-changed" : ""}`}
                  value={user.role || ""}
                  onChange={handleChange}
                >
                  <option value="">Select role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="technician">Technician</option>
                </select>
                {originalUser && changedFields.role && (
                  <div className="original-value">Original: {originalUser.role || "None"}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                  {changedFields.status && <span className="field-changed">Changed</span>}
                </label>
                <select
                  id="status"
                  name="status"
                  className={`form-select ${changedFields.status ? "input-changed" : ""}`}
                  value={user.status || ""}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {originalUser && changedFields.status && (
                  <div className="original-value">Original: {originalUser.status || "None"}</div>
                )}
              </div>
            </div>
          </div>
          <div className="profile-footer">
            {hasChanges && (
              <button
                type="button"
                className="reset-button"
                onClick={() => {
                  setUser(originalUser)
                  setChangedFields({})
                }}
              >
                Reset Changes
              </button>
            )}
            <button
              type="submit"
              className={`submit-button ${!hasChanges ? "button-disabled" : ""}`}
              disabled={loading || !hasChanges}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.5rem 1rem;
        }
        
        .profile-card {
          max-width: 640px;
          margin: 0 auto;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        
        .profile-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .profile-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }
        
        .profile-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }
        
        .profile-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .profile-footer {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        
        .image-upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .profile-image-container {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e5e7eb;
        }
        
        .profile-image {
          object-fit: cover;
        }
        
        .profile-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
        }
        
        .profile-image-placeholder span {
          font-size: 2rem;
          font-weight: 700;
          color: #9ca3af;
        }
        
        .image-loading-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-upload-button-container {
          display: flex;
          align-items: center;
        }
        
        .image-upload-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #f3f4f6;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .image-upload-button:hover {
          background-color: #e5e7eb;
        }
        
        .hidden-input {
          display: none;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .field-changed {
          font-size: 0.75rem;
          font-weight: 500;
          color: #2563eb;
          background-color: #dbeafe;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }
        
        .form-input, .form-select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          width: 100%;
        }
        
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
        }
        
        .input-changed {
          border-color: #2563eb;
          background-color: #eff6ff;
        }
        
        .original-value {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }
        
        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover {
          background-color: #1d4ed8;
        }
        
        .button-disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        
        .reset-button {
          padding: 0.5rem 1rem;
          background-color: white;
          color: #4b5563;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .reset-button:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }
        
        .alert {
          margin: 1rem 1.5rem 0;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        .alert-success {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .alert-error {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        
        .alert-info {
          background-color: #e0f2fe;
          color: #0369a1;
        }
        
        .changes-banner {
          margin: 1rem 1.5rem 0;
          padding: 0.75rem 1rem;
          background-color: #fffbeb;
          color: #92400e;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 3px solid white;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        
        .spinner-small {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

