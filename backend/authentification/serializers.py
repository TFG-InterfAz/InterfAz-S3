from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True)
    first_name = serializers.CharField(
        required=True)
    last_name = serializers.CharField(
        required=True)
    email = serializers.EmailField(
        required=True)
    password = serializers.CharField(
        min_length=8)

    class Meta:
        model = get_user_model()
        fields = ('username', 'first_name','last_name','email','password')
    
    def validate_password(self, value):
        return make_password(value)
        