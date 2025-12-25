from sqlmodel import create_engine, text, SQLModel
from sqlalchemy.ext.asyncio import AsyncEngine
from src.config import Config
from sqlalchemy import text
from src.db.model import Book
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import sessionmaker, Session

# basic engine
# engine=create_engine(
#     url=Config.DB_URL,
#     echo=True
# )

# async engine
engine= AsyncEngine(
    create_engine(
    url=Config.DB_URL,
    # echo=True 
)) 

async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.create_all())
        await conn.run_sync(lambda sync_conn: SQLModel.metadata.create_all(bind=sync_conn))
        # statement=text("SELECT 'hellodb' ")
        print("Database initialized successfully")
        # res=await conn.execute(statement)
        # #print(res.all())

 
async def get_session() -> AsyncSession:

    Session = sessionmaker(
        bind = engine,
        class_ = AsyncSession,
        expire_on_commit = False
    )

    async with Session() as session:
        yield session
   