from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
import json


def home(request):  
    return render(request, 'home.html')

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})

@require_http_methods(["POST"])
def axios_connection(request):
    print("Headers:", request.headers)
    print("Body:", request.body)
    try:
        data = json.loads(request.body)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
