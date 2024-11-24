import "./Pics2.css";
import ImageUploader from "./dnd.jsx"
import { createSignal, onMount, createEffect, createResource } from 'solid-js';


function Pics(){
    const [selectedFile, setSelectedFile] = createSignal(null);
    const [imageSrc, setImageSrc] = createSignal(null);
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleUpload = async () => {
      if (!selectedFile()) {
        alert('Please select a file to upload.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', selectedFile());
  
      try {
        const response = await fetch('http://localhost:3000', { // Замените URL на ваш серверный адрес
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
        <div class="container">
            <div class="content_but">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
                {imageSrc() && <img src={imageSrc()} alt="Uploaded" />}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctioLorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur fugit atque quisquam consectetur quod tenetur tempora aliquid aspernatur unde distinctio
                 dolorem itaque saepe porro, rerum iure illo eaque incidunt culpa.

            

            </div>
        </div>
    );
  }
  
export default Pics;

  <main class="container">
  <div>
      <ImageUploader />
  </div>
</main>