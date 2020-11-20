from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import MemberSerializer, OrganizationSerializer
from api.models import Organization, Cause, Member, User
import logging

logger = logging.getLogger(__name__)

class CreateMember(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        user = User.objects.filter(id=request.data.get('user_id'))[0]
        organization = Organization.objects.filter(name=request.data.get('organization'))[0]
        data = {
            'member_type': request.data.get('member_type')
        }
        serializer = MemberSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user_id=user, organization=organization)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetMemberFromUser(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request):
        user_id = request.GET['user_id']
        members = Member.objects.filter(user_id=user_id)
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data)

class GetOrgsFromMember(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        user_id = request.GET['user_id']
        organizations = Organization.objects.filter(member__user_id=user_id)
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data)