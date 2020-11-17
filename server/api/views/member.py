from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import MemberSerializer, OrganizationSerializer, CauseSerializer
from api.models import Organization, Cause

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

#class GetOrgFromMember(APIView):
#    permission_classes = (permissions.AllowAny,)
#    authentication_classes = ()
    
#    def get(self, request):
#        causes = Cause.objects.all()
#        serializer = CauseSerializer(causes, many=True)
#        return Response(serializer.data)