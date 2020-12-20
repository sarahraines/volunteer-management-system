from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import OrganizationSerializer, CauseSerializer, FAQSerializer
from api.models import Organization, Cause, FAQ, Member
from django.shortcuts import get_object_or_404
from django.db.models import Count
import logging
import json

logger = logging.getLogger(__name__)

class CreateOrganization(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = OrganizationSerializer(data=data)
        if serializer.is_valid():
            org = serializer.save()
            org.causes.set(data.get('causes'))
            org.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetOrgInfo(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['orgId']
        organization = Organization.objects.filter(pk=org_id).prefetch_related('causes').first()
        logger.warn(organization)
        serializer = OrganizationSerializer(organization)
        return Response(serializer.data)

class GetCauses(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        causes = Cause.objects.all()
        serializer = CauseSerializer(causes, many=True)
        return Response(serializer.data)

class UpsertFAQ(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request, format='json'):
        data = request.data
        id = data.get('id')
        no_error_status = status.HTTP_200_OK if id else status.HTTP_201_CREATED
        if id:
            faq = FAQ.objects.get(pk=id)
            serializer = FAQSerializer(faq, data=data)
        else:
            serializer = FAQSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=no_error_status)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class GetFAQ(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        causes = FAQ.objects.filter(org_id=org_id)
        serializer = FAQSerializer(causes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteFAQ(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def delete(self, request):
        id = request.GET.get('id')
        faq = get_object_or_404(FAQ, pk=id)
        faq.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class GetMemberCountsByOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        orgId = request.GET['orgId'];
        members = Member.objects.filter(organization__id=orgId).values('member_type').annotate(Count('member_type'))
        members = list(members)

        y = [0, 0]

        for i in range(len(members)): 
            y[i] = members[i]['member_type__count']

        return Response(y, status=status.HTTP_200_OK)

