import "./User.css"
import { createSignal, onMount, createEffect, createResource } from 'solid-js';
import { getImage } from '../zaprosi/GetImage.js';// Импортируем функцию getImage


function Header(){
  const [images, setImages] = createSignal([]);
  const [error, setError] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [showImages, setShowImages] = createSignal(false);
  const [imageResource] = createResource(async () => {
    setLoading(true);
    const result = await getImage();
    setLoading(false);
    return result;
    });
    const handleClick = async () => {
      setShowImages(true);
      try {
        const result = await imageResource.loading ? imageResource.promise : await imageResource();
        if (result) {
          setImages(result);
        } else {
          setError(new Error("Сервер вернул пустой ответ или ошибку"));
        }
      } catch (err) {
        setError(err);
      }
    };
    return(
      <div class="container1"> 
        <button onClick={handleClick}>Загрузить изображения</button>
        {showImages() && (
          <Suspense fallback={<div>Загрузка...</div>}>
            <div class="image-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
              {error() && <div>Ошибка: {error().message}</div>}
              {loading() ? null : images().map((image) => (
                <div class="image-item" key={image.url}>
                  <img src={image.url} alt={image.title} />
                  <p>{image.title}</p>
                </div>
              ))}
            </div>
          </Suspense>
        )}
      </div>
  )
  }
export default Header;