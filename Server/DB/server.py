import socket
import json
import time
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind(("localhost", 1234))
sock.listen()

print("Сервер запущен и слушает порт 1234...")

while True:
    try:
        print("Ожидание подключения...")
        conn, address = sock.accept()
        print(f"Подключено: {address}")
        
        # Читаем данные из сокета
        request_data = conn.recv(1024).decode()


        
        # Разделяем заголовки и тело запроса
        if "\r\n\r\n" in request_data:
            headers, body = request_data.split("\r\n\r\n", 1)
        else:
            headers, body = request_data, ""


        # Ищем Content-Length в заголовках
        content_length = None
        for line in headers.split("\r\n"):
            if line.lower().startswith("content-length:"):
                content_length = int(line.split(":")[1].strip())
                break

        
        if content_length:
            # Читаем дополнительные данные, если тело запроса больше
            remaining_data = conn.recv(content_length - len(body)).decode()
            body += remaining_data
            print(f"Дополнительные данные получены: {remaining_data}")
        
        # Печатаем окончательное тело запроса
        print(f"Полное тело запроса: {body}")

        
        try:
            # Преобразуем тело в JSON
            json_data = json.loads(body)

            print("Полученные данные (JSON):")
            print(json.dumps(json_data, indent=4))

        except json.JSONDecodeError as e:
            print(f"Ошибка при разборе JSON: {e}")
            json_data = {"error": "Invalid JSON format"}
        
        # Формируем ответ в формате JSON
        response_data = {
            "status": "ok",
            "message": "Data received successfully",
            "received_data": json_data
        }
        
        response_body = json.dumps(response_data)

        # Отправляем ответ клиенту
        conn.sendall(response_body.encode())
        print("Ответ отправлен клиенту.")

        # Закрываем соединение
        conn.close()

    except Exception as e:
        print(f"Ошибка при обработке запроса: {e}")
        if conn:
            conn.close()

sock.close()