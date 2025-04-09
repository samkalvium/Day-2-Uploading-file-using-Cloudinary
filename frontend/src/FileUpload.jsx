import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);      
      setError("");          

      const res = await axios.post("http://localhost:5000/api/files/upload", formData);
      setImageUrl(res.data.url);
    } catch (error) {
      setError("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);    
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded file" />}
    </div>
  );
};

export default FileUpload;
