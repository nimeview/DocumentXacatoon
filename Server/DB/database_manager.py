from pymongo import MongoClient
import subprocess


class Database:
    '''
    Класс для работы с mongoDB.

    Атрибуты:
    host (str): URI подключение.
    name_db (str): имя базы данных.

    Методы:
    create_backup(): содание бэкапа
    insert_db_image(): создание объектов в коллекцию images.
    insert_db_user(): создание объектов в коллекцию users.
    insert_db_icon(): создание объектов в коллекцию icons.
    is_login_user(): проверка на существование логина пользователя.
    is_correct_login(): проверка на правильность логина и пароля.
    get_tiles(): возврат тайлов заданным условием.
    get_icon(): возврат изображения по имени.
    create_backup(): сохранение бекап
    restore_backup(): загрузка бекапа
    '''

    def __init__(self, host: str, name_db: str) -> None:
        self._URI = host
        self._db_name = name_db
        self._client = MongoClient(self._URI)
        self._db = self._client[self._db_name]

        self._images = self._db["images"]
        self._users = self._db["users"]
        self._icons = self._db["icons"]

        self._images.create_index([("name", 1), ("x", 1), ("y", 1)])
        self._users.create_index([("login", 1), ("password", 1)])
        self._icons.create_index([("_id", 1)])

    def restore_backup(self, backup_dir: str) -> None:
        '''
        Метод восстанавливает базу данных из бэкапа,
        созданного с использованием mongodump.

        Параметры:
        :backup_dir: путь к директории с бэкапом.
        '''
        restore_command = [
            "sudo", "mongorestore",
            "--uri", self._URI,
            "--db", self._db_name,
            "--drop",
            f"{backup_dir}/backup_{self._db_name}_1"
        ]
        try:
            subprocess.run(restore_command, check=True)
            print(f"Бэкап базы данных {self._db_name} успешно восстановлен.")
        except subprocess.CalledProcessError as e:
            print(f"Ошибка при восстановлении бэкапа базы данных: {e}")

    def create_backup(self) -> None:
        '''
        Метод сохраняет бекап бд.

        Название бд бекапа: 'имя бд'_BACKUP
        '''
        '''
        Метод сохраняет бекап базы данных с использованием mongodump.

        Название бд бекапа: 'имя бд'_BACKUP
        '''
        backup_dir = "/path/to/backup_directory"
        command1 = [
            "sudo", "mongodump",
            "--uri", self._URI,
            "--db", self._db_name,
            "--out", f"{backup_dir}/backup_{self._db_name}_1",
            "--gzip"
        ]
        command2 = [
            "sudo", "mongodump",
            "--uri", self._URI,
            "--db", self._db_name,
            "--out", f"{backup_dir}/backup_{self._db_name}_2",
            "--gzip"
        ]
        try:
            subprocess.run(command1, check=True)
            subprocess.run(command2, check=True)
        except subprocess.CalledProcessError as e:
            print(f"Ошибка при создании бэкапа базы данных: {e}")

    def insert_db_image(self, data: dict) -> None:
        '''
            Метод сохраняет в коллекцию images тайлы.

            Пример входного json(data):
            {
                "name" : ...,
                "binary" : [ ... ],
                "x" : ...,
                "y" : ...
            }
            :param data Список словарей тайлов картинок.
        '''
        if not isinstance(data, dict):
            raise ValueError(f"Ожидание dict, получен {type(data)}")
        if self._images.find_one({
            "name": data["name"],
            "x": data["x"],
            "y": data["y"]}
            ):
            raise KeyError("Такая картинка уже есть")
        self._images.insert_one(
                {
                    "name": data["name"],
                    "binary": data["binary"],
                    "x": data["x"],
                    "y": data["y"]
                }
            )

    def insert_db_user(self, data: dict) -> None:
        '''
            Метод сохраняет в коллекцию users информацию
            о пользователях.

            Пример входного json(data):
            {
                "login" : ...,
                "password" : ...,
                "roots" : [ ... ]
            }
            :param data: Cловарь с данными нового пользователя.
        '''
        if not isinstance(data, dict):
            raise ValueError(f"Ожидание dict, получен {type(data)}")
        if self.is_login_user(data["login"]):
            return False
        self._users.insert_one(
                {
                    "_id": data["login"],
                    "password": data["password"],
                    "roots": data["roots"]
                })

    def is_login_user(self, login: str) -> bool:
        '''
        Метод находит существующего пользователя по login

        :param login: Словарь с логином, который пользователь вводит
        Пример входного json(data):
        { "login": ...}
        '''
        if self._users.find_one({"_id": login}):
            return True
        return False

    def is_correct_login(self, data: dict) -> bool:
        '''
        Метод сверяет вводимый логин и пароль с бд

        :param data: Словарь с логином и паролем пользователя
        Пример входного json(data):
        {
        "login": ...,
        "password": ...
        }
        '''
        if self._users.find_one(
                {
                    "_id": data["login"],
                    "password": data["password"]}
                ):
            return True
        return False

    def get_tiles(self, name: str, args: tuple) -> list:
        '''
        Метод возвращает список словарей с словарями нужных тайлов.

        :param name: Название нужного изображения
        :param args: Кортеж с координатами.

        :return: Список словарей вида { "binary": [ ... ], "x": ..., "y": ...}.
        Пример при тайлах 256х256:
        >> args = (0, 0, 1024, 1024)
        << "список из 16 словарей"
        '''
        return list(self._images.find({
            "name": name,
            "x": {"$gte": args[0], "$lte": args[2]},
            "y": {"$gte": args[1], "$lte": args[3]}
            },
            {
            "_id": 0,
            "name": 0,
            }))

    def insert_db_icon(self, data: dict) -> None:
        '''
        Метод сохраняет в бд сжатые изображения.

        :param data: словарь с метаданными.
        Пример входного json(data):
        {
            "name": ...,
            "binary": [ ... ]
        }
        '''
        self._icons.insert_one({
            "_id": data["name"],
            "binary": data["binary"]
            })

    def get_icon(self, name: str) -> dict:
        '''
        Метод возвращает бинарник иконки.

        :param name: имя картинки.
        :return: Словарь с бинарником ("binary").
        '''
        return dict(self._icons.find_one({"_id": name}, {"_id": 0}))
