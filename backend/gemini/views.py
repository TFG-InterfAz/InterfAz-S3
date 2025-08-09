import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import json
import google.genai as genai

# Load environment variables from .env
load_dotenv()

# Get the Gemini API key
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

@csrf_exempt
def gemini_query(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)
        prompt = data.get("prompt", "")

        if not prompt.strip():
            return JsonResponse({"error": "Prompt cannot be empty"}, status=400)

        # Send prompt to Gemini model
        response = client.models.generate_content(
            model="gemini-1.5-flash",  # or gemini-pro / gemini-1.5-pro
            contents=prompt
        )

        return JsonResponse({"response": response.text})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
