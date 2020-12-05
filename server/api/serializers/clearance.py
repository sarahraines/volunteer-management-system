from rest_framework import serializers
from api.models import OrgFile, UserFile

class OrgFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrgFile
        fields = ['id', 'organization', 'empty_form']
        
class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = ['id', 'org_file', 'user', 'filled_form']