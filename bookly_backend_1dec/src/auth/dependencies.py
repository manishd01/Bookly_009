# from http.client import HTTPException
from dns.e164 import to_e164
from fastapi import HTTPException, status, Depends
# from alembic.util import status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from flask import session
from pycparser.ply.yacc import token
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette.requests import Request
from watchfiles import awatch
from typing import List,Any
from src.db.redis import token_in_blocklist
from src.db.model import User
from .utils import decode_token
from src.db.main import get_session
from .service import UserService
from src.errors import *

user_service = UserService()

class TokenBearer(HTTPBearer):
    def __init__(self,auto_error=True ):
        super().__init__(auto_error=auto_error)

    # async def __call__(self, *args, **kwargs): //call fcuntion in httpModule check
    async def __call__(self, request : Request)-> HTTPAuthorizationCredentials | None:
        creds = await super().__call__(request)
        token = creds.credentials
        token_data = decode_token(token)
        # #print(token_data, " tttttt ", token)

        #a1. First check if token_data is valid (not None)
        # if not token_data:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="3Invalid token , enter correct onne......"
        #     )

        #print(token_data," tttttt ", token)

        # #a2. Then check if token is valid using your method  --- using self.token_valid funtions
        # if not self.token_valid(token):
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail={
        #             "Error": "2Invalid or expired token",
        #             "resolution": "please get a new token"
        #             }
        #     ) #keeping tihsi cause token_valid is also there
        # a1 and a2 doing the same things , diff way of writing:
        

        if not self.token_valid(token):
            raise InvalidToken()


        # Now safe to check 'refresh' key
        # if not token_data.get('refresh', False):
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="1Invalid or expired token"
        #     )

        # if not self.token_valid:
        #     raise HTTPException(
        #         status_code = status.HTTP_403_FORBIDDEN,
        #         detail = "INvalid or expired token"
        #     )
        # have to passs refresh token while checking in postman, not the acess token
        #print("eeee",token_data['refresh'])

        # if await token_in_blocklist(token_data['jti']):
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail={
        #             "error":"invalid token or revoked token",
        #             "resolution": "please get a new token to fix"
        #             }

        #     )
        if await token_in_blocklist(token_data['jti']):
            raise InvalidToken()

        self.verify_token_data(token_data)

        return token_data


    def token_valid(self, token : str ) -> bool:
        token_data = decode_token(token)
        if token_data is not None:
            return True
        else:
            return False


    def verify_token_data(self, token_data):
        raise NotImplemented( "please overdie in child classes")


class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict)-> None:
        # if token_data and token_data['refresh']:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="please provide accesT"
        #     )
        if token_data and token_data['refresh']:
            raise AccessTokenRequired()

class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict)-> None:
        if token_data and (not token_data['refresh']):
            # raise HTTPException(
            #     status_code=status.HTTP_403_FORBIDDEN,
            #     detail="please provide RefreshhT"
            # )
            raise RefreshTokenRequired()


async def get_current_user(token_details: dict = Depends(AccessTokenBearer()),
                     session : AsyncSession = Depends(get_session)):
    user_email = token_details['user']['email']
    user = await user_service.get_user_by_email(user_email,session)
    return user



class RoleChecker:
    def __init__(self, allowed_roles : List[str] ) -> None:
        self.allowed_roles = allowed_roles

    def __call__(self, current_user:User = Depends(get_current_user)) -> Any:
        #print(current_user,"dd", self.allowed_roles)
        if current_user.role in self.allowed_roles:
            return True
        else:
            # raise HTTPException(
            #     status_code=status.HTTP_403_FORBIDDEN,
            #     detail="you are nnot permmitted to perform this action"
            # )
            raise InsufficientPermission()

