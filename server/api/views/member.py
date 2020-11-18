from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import MemberSerializer, OrganizationSerializer
from api.models import Organization, Cause, Member
import logging

logger = logging.getLogger(__name__)

class CreateMember(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = MemberSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetOrgsFromMember(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        user_id = request.GET['user_id']
        organizations = Organization.objects.filter(member__user_id=user_id)
        #members = Member.objects.filter(user_id=user_id)
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data)