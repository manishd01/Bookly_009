# utility funcs
import logging
import uuid
import jwt
from datetime import timedelta, datetime
from jwt.exceptions import PyJWTError
from passlib.context import CryptContext
from pycparser.ply.yacc import token
from itsdangerous import URLSafeTimedSerializer #for taking a string and create a token, with timed expiry
import hashlib
import base64
from passlib.context import CryptContext

# from passlib.ext.django.models import password_context
from src.config import Config

ACCESS_TOKEN_EXPIRY = 3600

# password_context = CryptContext(
#     schemes=['bcrypt']
# )

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_hash(password: str) -> str:
    return password_context.hash(password)

def verify_hash(password: str, hashed: str) -> bool:
    return password_context.verify(password, hashed)

 
# def verify_passwd(password: str, hash: str) -> bool:
#     return password_context.verify(password, hash)


def create_access_token(user_data: dict, expiry: timedelta = None,
                        refresh : bool = False):
    payload = {}
    payload['user'] = user_data
    payload['exp'] = datetime.now() + (expiry if expiry is not None
                                     else timedelta(seconds=ACCESS_TOKEN_EXPIRY))
    payload['jti'] = str(uuid.uuid4())
    payload['refresh'] =  refresh

    token = jwt.encode(
        payload = payload,
        key = Config.JWT_SECRET,
        algorithm = Config.JWT_ALGORITHM
         # algo = Config.JWT_ALGO  -> will not work, same name to match
    )
    return token

def decode_token(token :  str) -> dict:
    try:
        # token_data = jwt.decode(
        #     jwt = token,
        #     key = Config.JWT_SECRET,
        #     algorithm =[Config.JWT_ALGORITHM] //use same names
        # )
        token_data = jwt.decode(
            token,
            key=Config.JWT_SECRET,
            algorithms=[Config.JWT_ALGORITHM]
        )
        return token_data
    except jwt.PyJWTError as e:
        logging.exception(e)
        return None


# "email":"rrr@s23",   "password1":"rrrrrr",

serializer = URLSafeTimedSerializer(
        secret_key=Config.JWT_SECRET,
        salt = "email-configuration"
    )

def create_url_safe_token(data : dict): 
    token = serializer.dumps(data)
    print("created url safe token:", token)
    return token

# def decode_url_safe_token(token : str):
#     try:
#         token_data = serializer.load(token)
#         return token_data
#     except Exception as e:
#         logging.error(str(e))
        
from itsdangerous import BadSignature, SignatureExpired
import logging
def decode_url_safe_token(token: str, max_age: int = 3600):
    try:
        token_data = serializer.loads(token, max_age=max_age)
        return token_data
    except SignatureExpired:
        logging.error("Token expired")
        return None
    except BadSignature:
        logging.error("Invalid token")
        return None

