from src.db.model import User
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from .schema import UserCreateModel
from .utils import generate_hash

class UserService:
    async def get_user_by_email(self,email :str, session: AsyncSession):
        statement = select(User).where(User.email == email)
        res = await session.exec(statement)
        book = res.first()
        return book

    async def user_exists(self,email, session : AsyncSession):
        user = await self.get_user_by_email(email, session)
        if user is None:
            return False
        else:
            return True

    async def create_user(self, user_data :UserCreateModel, session:  AsyncSession ):
        user_data_dict = user_data.model_dump()
        new_user = User(
            **user_data_dict
        )
        new_user.password_hash = generate_hash(user_data_dict['password1'])
        new_user.role = "user" #user role by herre

        session.add(new_user)
        await session.commit()
        await session.refresh(new_user) #this is imp to write, to avoid lazy ladoing
        return new_user

    async def update_user(self,user: User, user_data: dict, session: AsyncSession):
        for k,v in user_data.items():
            setattr(user, k, v)

        await session.commit()
        return user