from pymongo import MongoClient


class Database:
    '''
    Класс для работы с mongoDB.

    Атрибуты:
    host (str): URI подключение.
    name_db (str): имя базы данных.


    Методы:
    insert_db_image(): создание объектов в коллекцию images.
    insert_db_user(): создание объектов в коллекцию users.
    is_login_user(): проверка на существование логина пользователя
    is_correct_login(): проверка на правильность логина и пароля
    '''

    def __init__(self, host: str, name_db: str) -> None:
        self._client = MongoClient(host)
        self._db = self._client[name_db]

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
            raise ValueError(f"Ожидание list, получен {type(data)}")
        if self._db["images"].find_one({"name": data["name"]}):
            raise KeyError("Такая картинка уже есть")
        self._db["images"].insert_one(
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
        self._db["users"].insert_one(
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
        if self._db["users"].find_one({"_id": login}):
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
        if self._db["users"].find_one(
                {
                    "_id": data["login"],
                    "password": data["password"]}
                ):
            return True
        return False
