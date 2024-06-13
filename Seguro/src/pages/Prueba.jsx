import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

export default function Prueba() {
  const sigCanvas = useRef();
  const [imageURL, setImageURL] = useState(null);
  const create = () => {
    const URL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    console.log(URL);
    setImageURL(URL);
  };

  const download = async () => {
    const formData = new FormData();
    formData.append("file", imageURL);
    formData.append("upload_preset", "IntegradorProyector");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dauazz3dm/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImageUrl(response.data.secure_url);
      setUploading(false);
      console.log(response.data);
      alert("Imagen subida con éxito");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setUploading(false);
      alert("Error al subir la imagen");
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "IntegradorProyector");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dauazz3dm/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImageUrl(response.data.secure_url);
      setUploading(false);
      console.log(response.data);
      alert("Imagen subida con éxito");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setUploading(false);
      alert("Error al subir la imagen");
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className=" border-2 ">
      <SignatureCanvas
        penColor="black"
        canvasProps={{
          width: 500,
          height: 200,
          className: "sigCanvas border-2",
        }}
        ref={sigCanvas}
      />
      <hr />
      <button onClick={() => sigCanvas.current.clear()}>Clear</button>
      <button className="create" onClick={create}>
        Create
      </button>
      <br />
      {imageURL && (
        <div>
          <img src={imageURL} alt="signature" className="signature" />
          <button
            onClick={download}
            style={{ padding: "5px", marginTop: "5px" }}>
            Download
          </button>
        </div>
      )}
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Subiendo..." : "Subir a Cloudinary"}
        </button>
        {imageUrl && (
          <div>
            <h2>Imagen Subida:</h2>
            <img
              src={imageUrl}
              alt="Imagen subida"
              style={{ width: "300px" }}
            />
          </div>
        )}
      </div>
      <div>
        <h1>Subir y mostrar una foto</h1>
        <input type="file" onChange={handleImageChange} />
        {selectedImage && (
          <div>
            <h2>Foto seleccionada:</h2>
            <img src={selectedImage} alt="Selected" className=" w-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}
