// ImageUploader.jsx
import { createSignal } from "solid-js";
import { uploadImage } from '../zaprosi/Upload.js';

function ImageUploader() {
  const [images, setImages] = createSignal([]);
  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setImages([...images(), ...imageFiles]);
    }
  };

  const handleUpload = async () => {
    const promises = images().map(file => uploadImage(file));
    await Promise.all(promises);
    alert('Изображения успешно загружены!');
  };

  return (
    <div style={{ margin: "20px" }}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-input"
      />
      <label htmlFor="file-input" style={{ 
        padding: "10px 20px", 
        borderRadius: "5px", 
        cursor: "pointer" 
      }}>
        Загрузить изображения
      </label>
      <button onClick={handleUpload} style={{ marginLeft: "10px"}}>
        Отправить изображения
      </button>
      <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
        {images().map((file) => (
          <div key={file.name} style={{ margin: "5px", textAlign: "center" }}>
            <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: "100px" , height: "auto" }} />
            <div>{file.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;
