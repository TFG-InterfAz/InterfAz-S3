from rest_framework import serializers
from .models import Generated_Html


class Generated_HtmlSerializer(serializers.ModelSerializer):
    class Meta:
        model = Generated_Html
        fields = '__all__'