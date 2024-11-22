import socket
import json
from database_manager import Database

db = Database(host="mongodb://localhost:27017/", name_db="my_database")

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind(("localhost", 1234))
sock.listen()

def handle_get_request():
    try:
        # Пример получения всех изображений из базы данных
        images = db.get_images()  # Предполагаем, что метод get_images() существует
        users = db.get_users()    # Предполагаем, что метод get_users() существует

        # Формируем JSON-ответ
        response_data = {
            "images": images,
            "users": users
        }
        return json.dumps(response_data), 200
    except Exception as e:
        return f"Ошибка при получении данных: {e}", 500

def handle_post_request(request_data):
    # Получаем размер тела запроса
    content_length = None
    headers = request_data.split("\r\n")
    for header in headers:
        if header.lower().startswith("content-length"):
            content_length = int(header.split(":")[1].strip())

    # Если content-length найден, получаем тело запроса
    if content_length:
        # Получаем тело запроса
        body = conn.recv(content_length).decode()
        print(f"Получено тело запроса: {body}")  # Выводим тело запроса как строку

        # Проверяем, пустое ли тело запроса
        if not body:
            print("Тело запроса пустое!")
            return "Ошибка: пустое тело запроса", 400

        try:
            # Пытаемся распарсить JSON
            json_data = json.loads(body)
            print(f"Парсинг JSON успешен. Полученные данные:")
            print(json.dumps(json_data, indent=4))  # Выводим полученный JSON в форматированном виде

            # Обрабатываем изображения, если они есть
            for image in json_data.get("images", []):
                try:
                    db.insert_db_image(image)
                    print(f"Картинка {image['name']} добавлена в базу данных.")
                except Exception as e:
                    print(f"Ошибка при добавлении картинки {image['name']}: {e}")

            # Обрабатываем пользователей, если они есть
            for user in json_data.get("users", []):
                try:
                    db.insert_db_user(user)
                    print(f"Пользователь {user['login']} добавлен в базу данных.")
                except Exception as e:
                    print(f"Ошибка при добавлении пользователя {user['login']}: {e}")
            
            return "Данные успешно добавлены в базу данных", 200

        except json.JSONDecodeError:
            print("Ошибка при разборе JSON")
            return "Ошибка при разборе JSON", 400

    else:
        print("Ошибка: нет заголовка content-length")
        return "Ошибка: нет тела запроса", 400

print("Сервер запущен и слушает порт 1234...")

while True:
    try:
        print("Ожидание подключения...")
        conn, address = sock.accept()
        print(f"Подключено: {address}")

        request_data = conn.recv(1024).decode()
        if request_data:
            print(f"Получен запрос: {request_data}")
        else:
            print("Запрос не был получен")

        headers = request_data.split("\r\n")
        method = headers[0].split()[0]  # HTTP метод (GET, POST и т.д.)
        path = headers[0].split()[1]    # Путь (например, /images)

        # Если это GET-запрос
        if method == "GET":
            if path == "/data":  # Можно указать путь, например /data для получения данных
                response_body, status_code = handle_get_request()
            else:
                response_body = "404 Not Found"
                status_code = 404

        # Если это POST-запрос
        elif method == "POST":
            if path == "/data":  # Путь для вставки данных
                response_body, status_code = handle_post_request(request_data)
            else:
                response_body = "404 Not Found"
                status_code = 404

        else:
            response_body = "405 Method Not Allowed"
            status_code = 405

        # Формирование HTTP-ответа
        response = f"HTTP/1.1 200 OK\r\n"
        response += f"Content-Type: text/plain; charset=utf-8\r\n"
        response += f"Content-Length: {len(response_body.encode())}\r\n"
        response += f"\r\n"  # Пустая строка, отделяющая заголовки от тела
        # Отправка ответа клиенту
        conn.sendall(response.encode() + response_body.encode())
        print("Ответ отправлен клиенту.")

        # Закрытие соединения
    except Exception as e:
        print(f"Ошибка при обработке запроса: {e}")

sock.close()