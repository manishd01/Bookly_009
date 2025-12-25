from typing import Any, Callable
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi import FastAPI, status


class BooklyExceptions(Exception):
    """"this is baseclass of all exceptions"""
    pass

class InvalidToken(BooklyExceptions):
    """"user has given invalid or expired tokenn"""
    pass

class RevokedToken(BooklyExceptions):
    """"user has given a token that is already reavoked"""
    pass

class AccessTokenRequired(BooklyExceptions):
    """User has provided a refresh token when an access token is needed"""
    pass

class RefreshTokenRequired(BooklyExceptions):
    """User has provided an access token when a refresh token is needed"""
    pass


class UserAlreadyExists(BooklyExceptions):
    """User has provided an email for a user who exists during sign up."""
    pass


class InvalidCredentials(BooklyExceptions):
    """User has provided wrong email or password during log in."""
    pass


class InsufficientPermission(BooklyExceptions):
    """User does not have the neccessary permissions to perform an action."""
    pass

class UserAlreadyExists(BooklyExceptions):
    """User has provided an email for a user who exists during sign up."""
    pass


class InvalidCredentials(BooklyExceptions):
    """User has provided wrong email or password during log in."""
    pass


class BookNotFound(BooklyExceptions):
    """Book Not found"""
    pass


class TagNotFound(BooklyExceptions):
    """Tag Not found"""
    pass


class TagAlreadyExists(BooklyExceptions):
    """Tag already exists"""
    pass


class UserNotFound(BooklyExceptions):
    """User Not found"""
    pass


class AccountNotVerified(BooklyExceptions):
    """Account not yet verified"""
    pass


def create_exception_handler(status_code: int, initial_details: Any) -> Callable[[Request, Exception], JSONResponse]:
    async def exception_handler (request: Request, exc: BooklyExceptions):
        return JSONResponse(
            content=initial_details,
            status_code=status_code
        )
    return exception_handler


def register_all_errors(app: FastAPI):
    app.add_exception_handler(
        UserAlreadyExists,
        create_exception_handler(
            status_code = status.HTTP_403_FORBIDDEN,
            initial_details={
                "message": "User with this detials already exists",
                "error_code":"user_exists"
            }
        )
    )

    app.add_exception_handler(
        UserNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_details={
                "message": "User not found",
                "error_code": "user_not_found",
            },
        ),
    )
    app.add_exception_handler(
        BookNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_details={
                "message": "Book not found",
                "error_code": "book_not_found",
            },
        ),
    )
    app.add_exception_handler(
        InvalidCredentials,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_details={
                "message": "Invalid Email Or Password",
                "error_code": "invalid_email_or_password",
            }, 
        ), 
    ) 
    app.add_exception_handler(
        InvalidToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_details={
                "message": "Token is invalid Or expired",
                "resolution": "Please get new token",
                "error_code": "invalid_token",
            },
        ),
    )
    app.add_exception_handler(
        RevokedToken,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_details={
                "message": "Token is invalid or has been revoked",
                "resolution": "Please get new token",
                "error_code": "token_revoked",
            },
        ),
    )
    app.add_exception_handler(
        AccessTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_details={
                "message": "Please provide a valid access token",
                "resolution": "Please get an access token",
                "error_code": "access_token_required",
            },
        ),
    )
    app.add_exception_handler(
        RefreshTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_details={
                "message": "Please provide a valid refresh token",
                "resolution": "Please get an refresh token",
                "error_code": "refresh_token_required",
            },
        ),
    )
    app.add_exception_handler(
        InsufficientPermission,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_details={
                "message": "You do not have enough permissions to perform this action",
                "error_code": "insufficient_permissions",
            },
        ),
    )
    app.add_exception_handler(
        TagNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_details={"message": "Tag Not Found", "error_code": "tag_not_found"},
        ),
    )

    app.add_exception_handler(
        TagAlreadyExists,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_details={
                "message": "Tag Already exists",
                "error_code": "tag_exists",
            },
        ),
    )

    app.add_exception_handler(
        BookNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_details={
                "message": "Book Not Found",
                "error_code": "book_not_found",
            },
        ),
    )

    app.add_exception_handler(
        AccountNotVerified,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_details={
                "message": "Account Not verified",
                "error_code": "account_not_verified",
                "resolution":"Please check your email for verification details"
            },
        ),
    )

    @app.exception_handler(500)
    async def internal_server_error(request, exc):
        return JSONResponse(
            content={"meesage ": "oops something went wrong.....", 
                    "error_code":"server_error"},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )