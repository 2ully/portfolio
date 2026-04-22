from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Portfolio API")

# Enable CORS (Important because frontend and backend will run on different ports locally)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://2ully.github.io"],  # Adjust this to your specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the structure of the data expected from the frontend
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    service: str
    message: str

@app.post("/contact")
async def submit_contact_form(form: ContactForm):
    """
    Handle contact form submissions.
    Currently prints the data to the console.
    Uncomment and configure the SMTP code to send real emails.
    """
    try:
        # --- EMAIL SENDING LOGIC (SETUP REQUIRED) ---
        # To make this actually send an email to yourself, you need an SMTP server. 
        # For Gmail, you should use an "App Password".


        SENDER_EMAIL = os.getenv("SENDER_EMAIL")
        SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
        RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")
        
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = f"New Portfolio Inquiry from {form.name} - {form.service}"
            
        email_body = f"Name: {form.name}\nEmail: {form.email}\nService: {form.service}\n\nMessage:\n{form.message}"
        msg.attach(MIMEText(email_body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        # --------------------------------------------

        print("-" * 40)
        print("📨 NEW CONTACT FORM SUBMISSION")
        print(f"Name:    {form.name}")
        print(f"Email:   {form.email}")
        print(f"Service: {form.service}")
        print(f"Message:\n{form.message}")
        print("-" * 40)

        return {"status": "success", "message": "Your message was sent successfully."}

    except Exception as e:
        print(f"❌ Error handling submission: {e}")
        raise HTTPException(status_code=500, detail="There was an error processing your request. Please try again.")

# Run instructions:
# 1. Install dependencies: pip install fastapi uvicorn pydantic[email]
# 2. Run the server: uvicorn main:app --reload
