import socket
import json
import threading
import time
from database_manager import Database

db = Database('mongodb://localhost:27017/', 'Servise')

# Семофор для ограничения количества потоков
max_threads = 20
semaphore = threading.Semaphore(max_threads)

def handle_client(conn):
    start_time = time.time()  # Начало отсчета времени

    try:
        # Считывание потока данных
        request_data = conn.recv(8192).decode()
        print("Запрос получен: ", request_data)  # Логируем весь запрос

        # Деление HTTP запроса на заголовок и тело
        if "\r\n\r\n" in request_data:
            headers, body = request_data.split("\r\n\r\n", 1)
        else:
            headers, body = request_data, ""

        print("Тело запроса: ", body)  # Логируем тело запроса

        # Разбираем первую строку запроса, чтобы определить метод
        request_line = headers.split("\r\n")[0]
        method, path, _ = request_line.split()

        # Разбираем JSON, если есть
        try:
            json_data = json.loads(body)
            print("JSON данные: ", json_data)
            if isinstance(json_data, list):
                if len(json_data) > 0:
                    json_data = json_data[0]  # Логируем разобранные данные
        except json.JSONDecodeError:
            json_data = {}
            print("Ошибка при разборе JSON.")

        # Метод GET
        if method == "GET":
            if '_type' in json_data:
                if json_data['_type'] == 'icon':
                    icon_data = db.get_icon(json_data.get("name", ""))
                    response_data = icon_data
                elif json_data['_type'] == 'tile':
                    print(json_data.get("args", ()))
                    tiles = db.get_tiles(json_data.get("name", ""), json_data.get("args", ()))
                    response_data = tiles
                else:
                    response_data = {"error": "Unknown _type"}
            else:
                response_data = {"error": "_type field missing"}
            response_body = json.dumps(response_data)
            response_headers = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n"
            response_headers += f"Content-Length: {len(response_body)}\r\n\r\n"
            conn.sendall(response_headers.encode() + response_body.encode())

        # Метод POST
        elif method == "POST":
            if '_type' in json_data:
                if json_data['_type'] == 'image':
                    db.insert_db_image(json_data)
                    response_data = {"status": "success", "message": "Image inserted"}
                elif json_data['_type'] == 'user':
                    db.insert_db_user(json_data)
                    response_data = {"status": "success", "message": "User inserted"}
                else:
                    response_data = {"error": "Unknown _type"}
            else:
                response_data = {"error": "_type field missing"}
            response_body = json.dumps(response_data)
            response_headers = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n"
            response_headers += f"Content-Length: {len(response_body)}\r\n\r\n"
            conn.sendall(response_headers.encode() + response_body.encode())

        # Ответ для других HTTP методов
        else:
            response_body = json.dumps({"error": "Method Not Allowed"})
            response_headers = "HTTP/1.1 405 Method Not Allowed\r\nContent-Type: application/json\r\n"
            response_headers += f"Content-Length: {len(response_body)}\r\n\r\n"
            conn.sendall(response_headers.encode() + response_body.encode())
    except Exception as e:
        print(f"Ошибка при обработке запроса: {e}")
    finally:
        # Закрытие соединения
        conn.close()

        # Завершаем работу потока, выводим время выполнения
        end_time = time.time()
        print(f"Запрос выполнен за {end_time - start_time:.4f} секунд.")
# Сервер на библиотеке SOCKET
def server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) #AF_INET - Internet Protocol v4; SOCK_STREAM сокет для TCP запросов
    sock.bind(("localhost", 1234)) # Привязка сокета к конкретному сетевому интерфейсу и номеру порта
    sock.listen() # Прослушивание соединения

    while True:
        print("Ожидание подключения...")
        conn, address = sock.accept()
        print(f"Подключено: {address}")
        
        # Проверка на количество активных потоков
        semaphore.acquire()  # Захват семафора, если достигнут предел, поток будет ожидать

        # Запуск нового потока для обработки запроса
        threading.Thread(target=handle_client, args=(conn,)).start()

if __name__ == "__main__":
    server()
