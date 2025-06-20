from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status,generics
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

class HomeView(APIView):
     
   permission_classes = (IsAuthenticated, )
   def get(self, request):
       content = {'message': 'Welcome to the JWT  Authentication page using React Js and Django!'}
       return Response(content)
   
class LogoutView(APIView):
     permission_classes = (IsAuthenticated,)
     def post(self, request):
          
          try:
               refresh_token = request.data["refresh_token"]
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
               return Response(status=status.HTTP_400_BAD_REQUEST)
          

class PrivateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": f" Hello, {request.user.username}. Welcome to your private area"
        })

class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer