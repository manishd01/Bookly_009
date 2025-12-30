import asyncio
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

# ✅ import from db.main (this file EXISTS)
from src.db.main import get_session
from src.db.model import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


USERS = [
    # SAME EMAIL (1 Seller + 2 Buyers)
    {
        "username": "manish_seller",
        "email": "mannishh021@randomm.com",
        "first_name": "Manish",
        "last_name": "Sharma",
        "role": "Seller",
        "password": "rrrrrr",
    },
    {
        "username": "manish_buyer1",
        "email": "mannishh02@gmail.com",
        "first_name": "Rohit",
        "last_name": "Verma",
        "role": "Buyer",
        "password": "rrrrrr",
    },
    {
        "username": "manish_buyer2",
        "email": "mannishh04@randomm.com",
        "first_name": "Amit",
        "last_name": "Kumar",
        "role": "Buyer",
        "password": "rrrrrr",
    },

    # Buyers
    {
        "username": "buyer_sneha",
        "email": "sneha@randomm.com",
        "first_name": "Sneha",
        "last_name": "Unna",
        "role": "Buyer",
        "password": "rrrrrr",
    },
    {
        "username": "buyer_rahul",
        "email": "rahul@randomm.com",
        "first_name": "Rahul",
        "last_name": "Mehta",
        "role": "Buyer",
        "password": "rrrrrr",
    },
    {
        "username": "buyer_priya",
        "email": "priya@randomm.com",
        "first_name": "Priya",
        "last_name": "Iyer",
        "role": "Buyer",
        "password": "rrrrrr",
    },

    # Sellers
    {
        "username": "seller_arjun",
        "email": "arjun@randomm.com",
        "first_name": "Arjun",
        "last_name": "Singh",
        "role": "Seller",
        "password": "rrrrrr",
    },
    {
        "username": "seller_kavya",
        "email": "kavya@randomm.com",
        "first_name": "Kavya",
        "last_name": "Nair",
        "role": "Seller",
        "password": "rrrrrr",
    },
    {
        "username": "seller_vikas",
        "email": "vikas@randomm.com",
        "first_name": "Vikas",
        "last_name": "Gupta",
        "role": "Seller",
        "password": "rrrrrr",
    },
    {
        "username": "seller_neha",
        "email": "neha@randomm.com",
        "first_name": "Neha",
        "last_name": "Agarwal",
        "role": "Seller",
        "password": "rrrrrr",
    },
]


async def seed_users():
    # ✅ CORRECT way to consume get_session()
    async for session in get_session():  # type: AsyncSession
        for user_data in USERS:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                role=user_data["role"],
                password_hash=hash_password(user_data["password"]),
            )
            session.add(user)

        await session.commit()
        print("✅ Users seeded successfully!")

# ----------------------------------seeding books-----------------------------
import asyncio
from datetime import date, timedelta
from random import randint, choice
from src.db.main import get_session
from src.db.model import Book

# Seller IDs
SELLER_IDS = [
    "28130db0-62c7-429d-864b-87e54f79785e",
    "2bfe9f5a-0f76-49f4-a429-53079dfe32e2",
    "31a4ebe4-71c8-421b-a10f-838b1498445b",
    "a723ed67-7df5-42ec-81cb-d1fc110ebd6a",
    "adaea7f2-8efc-4427-8633-a0a204bf4b1c"
]

BOOK_TITLES = [
    "Mystery of the Old Manor", "Journey to the Mountains",
    "Secrets of the Ocean", "Adventures in Space",
    "Legends of the Forest", "Chronicles of Time",
    "Tales of the Unknown", "Dreams of Tomorrow",
    "Voices from Beyond", "Shadows of the Past",
    "Whispers in the Wind", "Paths Untraveled",
    "Echoes of Eternity", "Hidden Realms", "Storm over Horizon"
]

BOOK_GENRES = ["Fiction", "Mystery", "Adventure", "Sci-Fi", "Fantasy", "Horror", "Romance", "Thriller"]

AUTHORS = ["Arjun Singh", "Kavya Nair", "Vikas Gupta", "Neha Agarwal", "Manish Sharma", "Rohit Verma", 
           "Amit Kumar", "Sneha Unna", "Rahul Mehta", "Priya Iyer", "Ananya Joshi", "Rohan Patil"]

def generate_isbn():
    """Generate a random 13-digit ISBN."""
    return "".join(str(randint(0, 9)) for _ in range(13))

def random_publish_date():
    """Generate a random date in the past 5 years."""
    today = date.today()
    delta_days = randint(0, 5*365)
    return today - timedelta(days=delta_days)

async def seed_books():
    async for session in get_session():  # type: AsyncSession
        for seller_id in SELLER_IDS:
            for _ in range(6):  # 6 books per seller
                title = choice(BOOK_TITLES) + f" #{randint(1,999)}"
                book = Book(
                    title=title,
                    author=choice(AUTHORS),
                    genre=choice(BOOK_GENRES),
                    publish_date=random_publish_date(),
                    pages=randint(100, 600),
                    isbn=generate_isbn(),
                    user_uid=seller_id
                )
                session.add(book)

        await session.commit()
        print("✅ 30 random books seeded successfully!")


if __name__ == "__main__":
    # asyncio.run(seed_users())
    asyncio.run(seed_books())


# // python -m src.scripts.seed_data_in_db_auto_