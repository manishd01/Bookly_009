
from smtp_email_sender import EmailSender, email_text

def send_email():
    try:
        sender = EmailSender(
            sender="yeahboi0078@gmail.com",
            password="alcsmgzbcflrxkqg",  # Use an App Password if 2FA is enabled
            smtp_server="smtp.gmail.com",
            smtp_port=587,
            use_tls=True,
            debug=True  # Set to False to actually send the email
        )

        sender.create_message(
            receiver="manishkum4042@gmail.com",
            subject="Test Email"
        ).attach(
            email_text("This is a test email sent using Python.", "plain")
        )

        sender.finish()
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

send_email()



# import requests

# API_KEY = "1C5E49D43DAE61D960E2BFD147ADCBC850FDD2F8357710FB22473EAEE8CA352D45F567B304BF1ED44A7C0C91FD3D7D89"
# FROM_EMAIL = "yeahboi0078@gmail.com"
# TO_EMAIL = "manishkum4042@gmail.com"
# SUBJECT = "Test Email via Elastic Email API"
# BODY = "Hello, this is a test email sent using Elastic Email HTTP API with Python!"

# url = "https://api.elasticemail.com/v2/email/send"

# payload = {
#     'apikey': API_KEY,
#     'from': FROM_EMAIL,
#     'to': TO_EMAIL,
#     'subject': SUBJECT,
#     'bodyText': BODY,
#     'isTransactional': True
# }

# response = requests.post(url, data=payload)
# if response.status_code == 200:
#     print("✅ Email sent successfully via API!")
# else:
#     print(f"❌ Failed to send email: {response.text}")




# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
 
# # Gmail credentials (App Password recommended, not normal password)
# EMAIL = "yeahboi0078@gmail.com"
# PASSWORD = "alcsmgzbcflrxkqg"  # App password
 
# # Receiver email
# TO_EMAIL = "manishkum4042@gmail.com"
 
# try:
#     # Setup SMTP server
#     server = smtplib.SMTP('smtp.gmail.com', 587, timeout=10)
#     server.ehlo()
#     server.starttls()
#     server.ehlo()
#     server.login(EMAIL, PASSWORD)
 
#     # Create the email
#     subject = "Test Email from Python"
#     body = """
#     Hi there,
 
#     This is a test email sent using Python's smtplib.
    
#     Regards,  
#     Python Script 🚀
#     """
 
#     msg = MIMEMultipart()
#     msg['From'] = EMAIL
#     msg['To'] = TO_EMAIL
#     msg['Subject'] = subject
#     msg.attach(MIMEText(body, 'plain'))
 
#     # Send email
#     server.sendmail(EMAIL, TO_EMAIL, msg.as_string())
#     print("✅ Email sent successfully!")
 
#     server.quit()
 
# except Exception as e:
#     print(f"❌ Error: {e}")
 
 

# # import smtplib

# # try:
# #     server = smtplib.SMTP('smtp.gmail.com', 587, timeout=10)
# #     server.ehlo()
# #     server.starttls()
# #     server.ehlo()
# #     server.login('yeahboi0078@gmail.com', 'alcsmgzbcflrxkqg')
# #     print("Connected and logged in successfully")
# #     server.quit()
# # except Exception as e:
# #     print(f"Error: {e}")

