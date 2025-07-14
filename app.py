import pywhatkit
from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def index():
    return "WhatsApp Automation server is running. Use the /send endpoint with a POST request to send a message.", 200

@app.route("/send", methods=["POST"])
def send_message():
    """
    Sends a WhatsApp message instantly.
    Expects a JSON payload with "phone_number" and "message".
    e.g. curl -X POST -H "Content-Type: application/json" -d '{"phone_number": "+<country_code><number>", "message": "Hello!"}' http://127.0.0.1:5000/send
    """
    data = request.get_json()
    phone_number = data.get("phone_number")
    message = data.get("message")

    if not phone_number or not message:
        return "Missing phone_number or message", 400

    try:
        # Sends the message instantly.
        # wait_time: The time to wait for the page to load and send the message.
        # tab_close: Closes the browser tab after sending the message.
        pywhatkit.sendwhatmsg_instantly(
            phone_number,
            message,
            wait_time=20,
            tab_close=True
        )
        return "Message scheduled successfully!", 200
    except Exception as e:
        return f"An error occurred: {str(e)}", 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
