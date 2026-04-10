import { useEffect, useState } from "react";
import axios from "axios";


export default function AdminResources() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("VIDEO");
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/resources");
      setResources(res.data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !description || !type || !file) {
      alert("Please fill all fields and choose a file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("file", file);

      await axios.post("http://localhost:3000/api/resources", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resource uploaded successfully!");

      setTitle("");
      setDescription("");
      setType("VIDEO");
      setFile(null);

      fetchResources();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload resource.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-resources-page">
      <div className="admin-resources-container">
        <h1>Admin Resource Management</h1>
        <p>Upload and manage mental health resources for students.</p>

        <form className="admin-resource-form" onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Resource title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Resource description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="VIDEO">VIDEO</option>
            <option value="AUDIO">AUDIO</option>
            <option value="BOOK">BOOK</option>
            <option value="IMAGE">IMAGE</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Resource"}
          </button>
        </form>

        <div className="admin-resource-list">
          <h2>Uploaded Resources</h2>

          {resources.length === 0 ? (
            <p>No resources uploaded yet.</p>
          ) : (
            resources.map((resource) => (
              <div key={resource._id} className="admin-resource-card">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <span>{resource.type}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}