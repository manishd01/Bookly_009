from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from src.config import Config
from pathlib import Path
 
BASE_DIR = Path(__file__).resolve().parent #get parent folder of mail.py file
template_path = BASE_DIR / 'templates'

if not template_path.is_dir():
    raise FileNotFoundError(f"Templates directory not found: {template_path}")

# will not work in office system:

mail_config = ConnectionConfig(
    MAIL_USERNAME=Config.MAIL_USERNAME,
    MAIL_PASSWORD=Config.MAIL_PASSWORD,
    MAIL_SERVER=Config.MAIL_SERVER,
    MAIL_PORT=587,
    MAIL_FROM=Config.MAIL_FROM,
    MAIL_FROM_NAME=Config.MAIL_FROM_NAME,
    MAIL_STARTTLS =True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS  = True,
    VALIDATE_CERTS  = True,
    TEMPLATE_FOLDER = template_path
)
 
mail = FastMail(
    config=mail_config
)
 
# mail.send_message()

def create_message(recipient : list[str], subject: str, body :str ):

    message = MessageSchema(
        recipients = recipient,
        subject=subject,
        body=body ,
        subtype=MessageType.html
    )
    return message
