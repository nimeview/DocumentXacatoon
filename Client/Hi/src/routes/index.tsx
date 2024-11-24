import { createSignal } from "solid-js";
import styles from './index.module.scss'


function App() {
  // variables 
  const [selectedFile, setSelectedFile] = createSignal(null);
  const [imageSrc, setImageSrc] = createSignal(null);
  const [fileName, setFileName] = createSignal(null)
  let meow;
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    const file = event.target.files[0]; 
    setFileName(file.name);
    let jsonObject = JSON.parse(jsonData);
    jsonObject.key = fileName();
    meow = JSON.stringify(jsonObject)
  };
  
  
  //fetching Data
  let jsonData = JSON.stringify({ key: "" });
  const handleUpload = async () => {
    if (!selectedFile()) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile());

    try {
      const response = await fetch(`http://localhost:3000?json=${encodeURIComponent(meow)}`, { // Замените URL на ваш серверный адрес
        method: 'POST',
        body: formData,
        
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    
      <div class={styles.body}>
        <a href="/login">Скачать изображение</a>
        <a href="/user" class={styles.ach}>Login</a>
        <div class={styles.container}>
          <label class={styles.lab}>
            <span class={styles.spa}>Drop files here</span>
            <input type="file" onChange={handleFileChange} class={styles.customFileInput}></input>
          </label>
          <button onClick={handleUpload} class={styles.btn}>Upload</button>
          {imageSrc() && <img src={imageSrc()} alt="Uploaded" class={styles.img}/>}
        </div>
      </div>
    </>
  );
}

export default App;