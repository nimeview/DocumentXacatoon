import { createSignal } from "solid-js";
import styles from './login.module.scss'

function App() {
  const [imageSrc, setImageSrc] = createSignal(null);

  const fetchImage = async () => {


    //ключём должен выступать 
      const jsonData = JSON.stringify({ key: "value" });

      try {
        const response = await fetch(`http://localhost:3000?json=${encodeURIComponent(jsonData)}`, {
          method: 'GET',
          
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImageSrc(url);
        } else {
          console.error('Server responded with an error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div class={styles.body}>
      <a href="/">Отправить изображение</a>
      <a href="/user" class={styles.ach}>Login</a>
      <a href=""></a>
      <title>meow</title>
      <button onClick={fetchImage} class={styles.btn}>Fetch Image</button>
      {imageSrc() && <img src={imageSrc()}  alt="Fetched" />}
    </div>
  );
}

export default App;


