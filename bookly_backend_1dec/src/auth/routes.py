from datetime import datetime
from email.mime.text import MIMEText
import smtplib

from fastapi import APIRouter, Depends, HTTPException, status ,Request, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.auth.service import UserService
from fastapi import HTTPException, status, Depends
from src.auth.utils import decode_token
from .dependencies import (
    AccessTokenBearer,
    RefreshTokenBearer,
    get_current_user,
    RoleChecker,
)

from .utils import *
# from ..db.model import Users
from .schema import EMailSchema, UserCreateModel, UserLoginModel
from ..errors import InvalidToken
from ..db.redis import add_jti_to_blocklist
from ..db.model import User
from ..db.main import get_session
from sqlalchemy.orm import Session
from .utils import verify_hash
from src.mail import mail , create_message
from src.config import Config
from src.errors import *
from src.mail import mail , create_message


from .service import UserService

from fastapi.exceptions import HTTPException

from src.db.model import User
from fastapi.responses import JSONResponse
from .dependencies import RefreshTokenBearer,AccessTokenBearer ,get_current_user, RoleChecker



user_service = UserService()
auth_router = APIRouter()




# ---------------------------
# --
# LOGIN
# -----------------------------

@auth_router.post("/login")
async def login(
    payload: UserLoginModel,
    db: AsyncSession = Depends(get_session)
):

    # 1️⃣ Fetch user by email
    stmt = select(User).where(User.email == payload.email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    print("user fetched for login:", user)
    if not user:
        raise HTTPException( 
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email does not exist"
        )

    # 2️⃣ Check password
    if not verify_hash(payload.password1, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    print("user authenticate done ")
    # 3️⃣ Create tokens
    access_token = create_access_token({
        "email": user.email,
        "uid": str(user.uid),
    })

    refresh_token = create_access_token({
        "email": user.email,
        "uid": str(user.uid),
    })

    print("tokens are:", access_token,"  __   ", refresh_token)
    # 4️⃣ Set cookies
    response = JSONResponse(
        content={"message": "Login successful"},
        status_code=200
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # True in prod
        samesite="lax",
        max_age=60 * 15,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )
    print("response from login:", response)
    return response
# -----------------------------
# REFRESH ACCESS TOKEN
# -----------------------------
@auth_router.get("/refresh_token")
async def refresh_access_token(
    token_details: dict = Depends(RefreshTokenBearer())
):
    expiry = token_details["exp"]

    if datetime.fromtimestamp(expiry) < datetime.now():
        raise InvalidToken()

    new_access_token = create_access_token(
        user_data=token_details["user"]
    )

    response = JSONResponse(
        content={"message": "access token refreshed"},
        status_code=status.HTTP_200_OK,
    )

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 15,
    )

    return response


# -----------------------------
# LOGOUT
# -----------------------------
@auth_router.get("/logout")
async def logout(token_details: dict = Depends(AccessTokenBearer())):
    jti = token_details["jti"]
    await add_jti_to_blocklist(jti)

    response = JSONResponse(
        content={"message": "logged out successfully"},
        status_code=status.HTTP_200_OK,
    )

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return response


# -----------------------------
# GET CURRENT USER
# -----------------------------
role_checker = RoleChecker(["admin", "Buyer", "Seller"])

@auth_router.get("/me")
async def me(request: Request, session: AsyncSession = Depends(get_session)):
    # 1️⃣ Check cookie
    print("ALL COOKIES present :", request.cookies)
    token = request.cookies.get("access_token")
    print("Access token from cookie in /me route:", token)
    if not token:
        return {"authenticated": False, "user": None}
 
    # 2️⃣ Decode JWT 
    payload = decode_token(token)
    if not payload or "user" not in payload:
        return {"authenticated": False, "user": None}

    user_email = payload["user"]["email"]

    user_service = UserService()
    # 3️⃣ Fetch user from DB
    user = await user_service.get_user_by_email(user_email, session)
    if not user:
        return {"authenticated": False, "user": None}

    print("current user fetched in utils:", user)
    # 4️⃣ Return user info
    return {
        "authenticated": True,
        "user": {
            "uid": str(user.uid),
            "email": user.email,
            "role": getattr(user, "role", "user")  # optional
        }, 
    }
    
    
# signup , send verification mail , verify account
@auth_router.post('/send_mail')
async def send_mail(emails: EMailSchema):
    print("entering in sending mail")
    recipients = emails.addresses
    subject = "Welcome"
    html = "<h1>WELCOME to the Bookly</h1>"
    print("2")
    # Create MIME email message
    msg = MIMEText(html, "html")
    msg["Subject"] = subject
    msg["From"] = Config.MAIL_FROM
    msg["To"] = ", ".join(recipients)
    print("3")
    try:
        # Connect to the SMTP server and send the email
        with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as server:
            server.starttls()  # Secure the connection
            print("4")
            server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
            server.sendmail(Config.MAIL_FROM, recipients, msg.as_string())

        return {"message": "Email sent successfully."}
    except Exception as e:
        return {"error": f"Failed to send email: {str(e)}"}

@auth_router.get('/verify/{token}')
async def verify_user_account(token:str, session: AsyncSession = Depends(get_session)):
    token_data = decode_url_safe_token(token)
    print("decoded token data:", token_data)
    user_email = token_data.get("email")
    print("user email from token:", user_email)
    if user_email:
        user = await user_service.get_user_by_email(user_email, session)
        if not user:
            raise UserNotFound()
        
        await user_service.update_user(user, {'is_verified': True}, session)
        return JSONResponse(
            {
                "message":"acccount verified succesffyully"
            }, status_code= status.HTTP_200_OK
        )
    return JSONResponse(content ={ 
        "message": "error occured furing veirifcation"
    }, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@auth_router.post('/signup' , status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreateModel,
                      bg_tasks : BackgroundTasks,
                      session : AsyncSession = Depends(get_session)):
    # bg_tasks : BackgroundTasks,
    print("role:", user_data.role)
    email = user_data.email
    print("proceeding to create new user...")
    user_exists = await user_service.user_exists(user_data.username, session)
    if user_exists:
        # raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
        #                   detail="user with email already exists..."  )
        raise UserAlreadyExists()
    print("proceeding to create new user...")
    new_user = await user_service.create_user(user_data, session)
    print("new user created:", new_user)
    # token = create_url_safe_token({"email": email})
    token = create_url_safe_token({"email": email})

    print("created verification token:", token)
    link = f"http://{Config.DOMAIN}/api/v1/auth/verify/{token}"
    print("verification link:", link)
    html_message = f"""
        <h1> verify your email: </h1>
        <p> please cllickk this <a href= "{link}"> to verify </p>
    """

    message= create_message(recipient=[email],
                            subject= "verifY EMail",
                            body=html_message)
    # # await mail.send_message(message)
    bg_tasks.add_task(mail.send_message,message) #added to background task

    return {"message": "Account created , Check the email for verify your account",
            "user": new_user    }
    # return {"message ":"user signedup"}
 





# //older routes  with  local storage token managemnt
    # from debugpy.adapter import access_token
# from fastapi import APIRouter, Depends, status, BackgroundTasks
# from sqlmodel.ext.asyncio.session import AsyncSession

# from .schema import EMailSchema ,UserCreateModel, UserModel, UserLoginModel, UserLoginModel, UserHaveBooksReviewsModel
# from .service import UserService
# from src.db.main import get_session
# from fastapi.exceptions import HTTPException
# from .utils import *
# from src.db.model import User
# from fastapi.responses import JSONResponse
# from .dependencies import RefreshTokenBearer,AccessTokenBearer ,get_current_user, RoleChecker
# from src.db.redis import add_jti_to_blocklist
# from datetime import datetime, timedelta
# from src.errors import *
# from src.mail import mail , create_message
# from src.config import Config
# from src.db.main import get_session


# REFRESH_TOKEN_EXPIRY = 1
# auth_router = APIRouter()
# user_service = UserService()
# role_checker = RoleChecker(['admin','user'])


# @auth_router.post('/send_mail')
# async def send_mail(emails: EMailSchema):
#     emails= emails.addresses
#     print("entrring in sending mail")
#     html = "<h1> WELCOME to the bookly </h1>"
#     message = create_message(
#         recipient= emails,
#         subject="wellcome",
#         body= html 
#     )
#     await mail.send_message(message)
#     return {"message": "EMail sent sucessfully...."}

# # import smtplib
# # from email.mime.text import MIMEText

# # @auth_router.post('/send_mail')
# # async def send_mail(emails: EMailSchema):
# #     print("entrring in sending mail")
# #     recipients = emails.addresses
# #     subject = "Welcome"
# #     html = "<h1>WELCOME to the Bookly</h1>"
# #     print("2")
# #     # Create MIME email message
# #     msg = MIMEText(html, "html")
# #     msg["Subject"] = subject
# #     msg["From"] = Config.MAIL_FROM
# #     msg["To"] = ", ".join(recipients)
# #     print("3")
# #     try:
# #         # Connect to the SMTP server and send the email
# #         with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as server:
# #             server.starttls()  # Secure the connection
# #             print("4")
# #             server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
# #             server.sendmail(Config.MAIL_FROM, recipients, msg.as_string())

# #         return {"message": "Email sent successfully."}
#     # except Exception as e:
#     #     return {"error": f"Failed to send email: {str(e)}"}

# @auth_router.get('/verify/{token}')
# async def verify_user_account(token:str, session: AsyncSession = Depends(get_session)):
#     token_data = decode_url_safe_token(token)
#     print("decoded token data:", token_data)
#     user_email = token_data.get("email")
#     print("user email from token:", user_email)
#     if user_email:
#         user = await user_service.get_user_by_email(user_email, session)
#         if not user:
#             raise UserNotFound()
        
#         await user_service.update_user(user, {'is_verified': True}, session)
#         return JSONResponse(
#             {
#                 "message":"acccount verified succesffyully"
#             }, status_code= status.HTTP_200_OK
#         )
#     return JSONResponse(content ={ 
#         "message": "error occured furing veirifcation"
#     }, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

   


# @auth_router.post('/signup' , 
#                   status_code=status.HTTP_201_CREATED)
# async def create_user(user_data: UserCreateModel,
#                       bg_tasks : BackgroundTasks,
#                       session : AsyncSession = Depends(get_session)):
#     email = user_data.email

#     user_exists = await user_service.user_exists(email, session)
#     if user_exists:
#         # raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
#         #                   detail="user with email already exists..."  )
#         raise UserAlreadyExists()

#     new_user = await user_service.create_user(user_data, session)

#     # token = create_url_safe_token({"email": email})
#     token = create_url_safe_token({"email": email})

#     print("created verification token:", token)
#     link = f"http://{Config.DOMAIN}/api/v1/auth/verify/{token}"
#     print("verification link:", link)
#     html_message = f"""
#         <h1> verify your email: </h1>
#         <p> please cllickk this <a href= "{link}"> to verify </p>
#     """

#     message= create_message(recipient=[email],
#                             subject= "verifY EMail",
#                             body=html_message)
#     await mail.send_message(message)
#     bg_tasks.add_task(mail.send_message,message) #added to background task

#     return {"message": "Account created , Check the email for verify your account",
#             "user": new_user    }
#     # return {"message ":"user signedup"}
 

# from passlib.context import CryptContext

# pwd_context = CryptContext(
#     schemes=["bcrypt"],
#     deprecated="auto"
# )

# def verify_passwd(password: str, hashed: str) -> bool:
#     return pwd_context.verify(password, hashed)




# # ------------login route with token generation: using JWT and sending access and refresh token to fontend to store in local storage:
# # -------------local storage setup: less secure 
# @auth_router.post('/login')
# async def login_users(login_data: UserLoginModel, session : AsyncSession = Depends(get_session)):
#     email = login_data.email
#     password = login_data.password1

#     print("logginegg...in", flush=True)
#     print("Debug messagecdd", flush=True)
#     user = await user_service.get_user_by_email(email, session)
#     print(user,"found or not", flush=True)
#     # sys.stdout.write(user,"found or not")
#     # return {"message ":"user logged"}

#     if user is not None:
#         password_valid = verify_passwd(password, user.password_hash)

#         if password_valid:
#             access_token = create_access_token(
#                 user_data = {
#                     'email' : user.email,
#                     'user_uid' : str(user.uid),
#                     "role" : user.role
#                 }
#             )
#             refresh_token = create_access_token(
#                 user_data = {
#                     'email' : user.email,
#                     'user_uid' : str(user.uid),
#                 },
#                 refresh = True,
#                 expiry = timedelta(days=REFRESH_TOKEN_EXPIRY)


#             )
#             return JSONResponse(
#                 content={
#                     "message":"Login Sucessfull",
#                     "access_token":access_token,
#                     "refresh_token": refresh_token,
#                     "user": {
#                         "user": user.email,
#                         "uid": user.uid
#                     }
#                 }
#             )
#         # raise HTTPException(
#         #     status_code=status.HTTP_403_FORBIDDEN,
#         #     detail= "Invalid email or password"
#         # )
#         raise InvalidCredentials()
    


# @auth_router.get('/refresh_token')
# async def get_new_access_token(token_details: dict = Depends(RefreshTokenBearer())):
#     # timestamp -> (1754583682) formAT and datetime object is different
#     expiry_timestamp = token_details['exp']
#     ##print(expiry_timestamp)

#     if datetime.fromtimestamp(expiry_timestamp) > datetime.now():
#         new_access_token = create_access_token(
#             user_data=token_details['user']
#         )
#         return JSONResponse(content={
#             "access_token": new_access_token
#         })
#     # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#     #                     detail="invalid,or expired token")
#     raise InvalidToken()

# @auth_router.get('/me', response_model= UserHaveBooksReviewsModel)
# async def get_current_user(user = Depends(get_current_user),
#                            _: bool = Depends(role_checker)):

#     return user


# @auth_router.get('/logout')
# async def revoke_token(token_details: dict = Depends(AccessTokenBearer())):
#     jti = token_details['jti']
#     await add_jti_to_blocklist(jti)
#     return JSONResponse(
#         content={
#             "message":"logged out succesfully"

#         },status_code=status.HTTP_200_OK
#     )

# @auth_router.get("/ping")
# async def ping():
#     return "pong"

#  #
#  # "email": "user1@example.com",
#  #    "password1": "pass1234"

# # "email": "maria@example.org",
# # "password1": "mypass6",
# #
# #   "email": "sam.smith@example.net",
# #     "password1": "abc12345",