from fastapi import FastAPI, status
from fastapi.requests import Request
import time
from fastapi.responses import JSONResponse
import logging
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.middleware.trustedhost import TrustedHostMiddleware

# disable uvicorn logger
logger = logging.getLogger('uvicorn.access')
logger.disabled  =True
 


# ///middlewares are applied for all routes in app cause it is on app instance'
# caannot raise exception in middlwares and return them as reponse, normally -> you have to return a json response only---

def register_middleware (app: FastAPI):
    
    @app.middleware('http')
    async def custom_logging(request:  Request, call_next):
        start_time = time.time()
        
        
        #print("before: --------------- ", start_time)
        response =  await call_next(request) #means now to next middleware (id any ) or handler function
        # // bascilly from route -> middleware -> next middlweware (if any) -> handler fcuntion
        processing_time = time.time() - start_time

        message = f"{request.method} -  {request.url.path} -- status code: {response.status_code} -- completed after {processing_time}seconds"

        #print("processed_time------------- : ", processing_time)
        #print("------------------------------------")
        print(message)
        #print("------------------------------------")

        return response

# not recommeded , it will ask token for login signup as weelll, that is wrong
    # @app.middleware('http')
    # async def authorisation (request:  Request, call_next):
    #     if not 'Authorization'  in request.headers:
    #         return JSONResponse(
    #             content={
    #                 "message": "not Authenticated user",
    #                 "Resolution": " please provide correct credentials for resolving"
    #             },
    #             status_code=status.HTTP_401_UNAUTHORIZED 
    #         )
    #     response =  await call_next(request)

    #     return response
     

    # app.add_middleware(CORSMiddleware,
    #                 allow_origins= ["*"], 
    #                 allow_methods = ["*"],
    #                 allow_headers= ["*"],
                    
    #                 ) 
    
    # app.add_middleware(TrustedHostMiddleware,
    #                    allowed_hosts=["localhost", "127.0.0.1"]
    #                    )
     
    # app.add_middleware(
    #     CORSMiddleware,
    #     allow_origins=[
    #         "http://localhost:5173", 
    #     ],
    #     allow_credentials=True,
    #     allow_methods=["*"],
    #     allow_headers=["*"],
    # )