# import redis.asyncio as redis
# from src.config import Config
#
# JTI_EXPIRY = 3600  # expiry time in seconds (1 hour)
#
# # Create Redis async client
# redis_token_blocklist = redis.Redis(
#     host=Config.REDIS_HOST,
#     port=Config.REDIS_PORT,
#     db=0,
#     decode_responses=True  # Automatically decode bytes to string
# )
#
# # Add JWT ID to Redis blocklist with expiration
# async def add_jti_to_blocklist(jti: str) -> None:
#     await redis_token_blocklist.set(
#         name=jti,
#         value="",       # Storing empty string as the value
#         ex=JTI_EXPIRY   # Expiry in seconds
#     )
#
# # Check if JWT ID exists in Redis blocklist
# async def token_in_blocklist(jti: str) -> bool:
#     exists = await redis_token_blocklist.exists(jti)
#     return exists == 1
#



# # import aioredis
# import redis.asyncio as redis
#
# from src.config import Config
#
# JTI_EXPIRY = 3600
# # Redis client
#
# redis_token_blocklist = redis.Redis(
#     host=Config.REDIS_HOST,
#     port=Config.REDIS_PORT,
#     db=0,
#     decode_responses=True  # Optional: Automatically decode to string
# )
#
#
# # Add JTI (JWT ID) to blocklist
# async def add_jti_to_blocklist(jti: str) -> None:
#     await redis_token_blocklist.set(
#         name=jti,
#         value="",
#         ex=JTI_EXPIRY  # Note: use 'ex' for expiry in seconds
#     )
#
# # Check if JTI is in blocklist
# async def token_in_blocklist(jti: str) -> bool:
#     exists = await redis_token_blocklist.exists(jti)
#     return exists == 1
#
#


#---------------------
# old cade with aioredis
# import aioredis #
# import redis.asyncio as redis
# from src.config import Config
#
# JTI_EXPIRY = 3600
#
# redis_token_blocklist = redis.Redis(
#     host=Config.REDIS_HOST,
#     port=Config.REDIS_PORT,
#     db=0
#
# )
#
# async def add_jti_to_blocklist(jti : str) -> None:
#     await redis_token_blocklist.set(
#         name=jti,
#         value="",
#         ex=JTI_EXPIRY
#     )
#
# async def token_in_blocklist(jti : str) -> bool:
#     jti = await redis_token_blocklist.get(jti)
#     return jti is not None


# //-----------------------
import fakeredis.aioredis  # fakeredis async support

JTI_EXPIRY = 3600

# Create a fake Redis client (no real network)
redis_token_blocklist = fakeredis.aioredis.FakeRedis()

async def add_jti_to_blocklist(jti: str) -> None:
    await redis_token_blocklist.set(name=jti, value="", ex=JTI_EXPIRY)

async def token_in_blocklist(jti: str) -> bool:
    jti_val = await redis_token_blocklist.get(jti)
    return jti_val is not None

# Now you can run these async functions in your tests without a Redis server!
