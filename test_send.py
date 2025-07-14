import pywhatkit
import time

print("Attempting to send a message...")

try:
    # PLEASE REPLACE with your own full international phone number
    phone_number = "+8613764176027" 
    message = "This is a direct test message."

    print(f"Sending to: {phone_number}")
    print(f"Message: {message}")

    # Increased wait_time to 60 seconds to ensure page loads
    pywhatkit.sendwhatmsg_instantly(
        phone_no=phone_number,
        message=message,
        wait_time=15,  # Increased wait time
        tab_close=True,
        close_time=10
    )
    print("\nMessage sent successfully!")
    # Wait a moment before the script exits to see the message.
    time.sleep(5)

except Exception as e:
    print(f"\nAn error occurred: {e}")

