from fastapi import FastAPI, status
from src.books.routes import crud_R
from contextlib import asynccontextmanager
from src.db.main import init_db
from src.auth.routes import auth_router
from src.reviews.routes import review_router
from src.tags.routes import tags_router
from src.errors import * #import (1,2,3,4,) likw this aslo you can write
from fastapi.responses import JSONResponse
from .middleware import register_middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

@asynccontextmanager
async  def life_span(app:FastAPI):
    print("app starting.....ff.")
    await init_db()
    yield
    print("app ending....")


version="v1"


app=FastAPI(
    title="Bookly",
    description="a restapi application for books",
    version=version,
    # lifespan=life_span #not using, this was approch1
)


register_all_errors(app)



register_middleware(app)

# ✅ CORS (CORRECT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Trusted hosts (optional but OK)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1"],
)


app.include_router(crud_R, prefix= f"/api/{version}/books", tags=["books"])
app.include_router(auth_router, prefix = f"/api/{version}/auth", tags=['auth'])
app.include_router(review_router, prefix=f"/api/{version}/reviews", tags=["reviews"])
app.include_router(tags_router,prefix=f"/api/{version}/tags", tags=["tags"])


import logging
logger = logging.getLogger("uvicorn.error")


@app.get("/hello")
def say_hello():
    print("hello route was called", flush=True)
    logger.info("hello route was called")
    return {"message": "hello"}



  

#  taskkill /PID 4968 /F
# python -m venv venv
# py -m uvicorn src:app --reload 
# //pip freeze > requirements_5dec.txt 
# venv\Scripts\activate 
# pip install -r requirements_5sep.txt
# pip install --upgrade -r requirements_18aug.txt
# alembic init migrations

# alembic revision --autogenerate -m "describe your changes"
# alembic upgrade head

# mysql -u root -p
# "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
 
# tani02
#  dr0221  
# mira.k@e.com      
