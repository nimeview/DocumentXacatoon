import "./Rentgeni.css"
import { createSignal, onMount, Suspense } from 'solid-js';
import { getImage } from '../zaprosi/GetImage.js';// Импортируем функцию getImage

const Rentgen = () => {
    const [images, setImages] = createSignal([]);
    const [error, setError] = createSignal(null);
    const [loading, setLoading] = createSignal(true);
  
    onMount(async () => {
      try {
        const fetchedImages = await getImage(); // Вызываем функцию getImage
        if (fetchedImages) { // Проверка на наличие данных от сервера
            setImages(fetchedImages);
        } else {
            setError(new Error('Сервер вернул пустой ответ'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    });
  return (
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
  );
};

export default Rentgen;

