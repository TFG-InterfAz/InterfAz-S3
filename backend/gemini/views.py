import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import google.generativeai as genai  # ✅ Correct import

# Load environment variables from .env
load_dotenv()

# Get the Gemini API key
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Gemini client
genai.configure(api_key=GEMINI_API_KEY)

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
        model = genai.GenerativeModel("gemini-1.5-flash")  # You can change to "gemini-pro"
        result = model.generate_content(prompt)

        return JsonResponse({"response": result.text})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
