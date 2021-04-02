from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import OrganizationSerializer, CauseSerializer, FAQSerializer, MemberSerializer
from api.models import Organization, Cause, FAQ, Member
from django.shortcuts import get_object_or_404
from django.db.models import Count
import logging
import json

logger = logging.getLogger(__name__)

class UpsertOrganization(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data.dict()

        if 'causes' in data:
            data['causes'] = data['causes'].split(',')

        image = data.get('image')
        if image == 'null':
            data['image'] = None

        id = data.get('id')
        no_error_status = status.HTTP_200_OK if id else status.HTTP_201_CREATED


        if id:
            org = Organization.objects.get(pk=id)
            serializer = OrganizationSerializer(org, data=data)
        else:
            serializer = OrganizationSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=no_error_status)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        if request.GET.get('orgId'):
            org_id = request.GET['orgId']
            org = Organization.objects.get(pk=org_id)
            serializer = OrganizationSerializer(org)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("Request missing parameter orgId", status=status.HTTP_400_BAD_REQUEST)

class GetCausesByOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        if request.GET.get('orgId'):
            org_id = request.GET['orgId']
            causes = Cause.objects.filter(organization=org_id).all()
            serializer = CauseSerializer(causes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("Request missing parameter orgId", status=status.HTTP_400_BAD_REQUEST)

class GetCauses(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        causes = Cause.objects.all()
        serializer = CauseSerializer(causes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class GetFAQ(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        faq = FAQ.objects.filter(org_id=org_id)
        serializer = FAQSerializer(faq, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteFAQ(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def delete(self, request):
        id = request.GET.get('id')
        faq = get_object_or_404(FAQ, pk=id)
        faq.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class GetMembersFromOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        members = Member.objects.filter(organization__id=org_id)
        serializer = MemberSerializer(members, many=True)

        for item in serializer.data:
            item['user']['name'] = item['user']['first_name'] + ' ' + item['user']['last_name']

        return Response(serializer.data)

class GetPublicOrgs(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        user_id = request.GET['user_id']
        orgs = Organization.objects.filter(is_public=True)
        org_serializer = OrganizationSerializer(orgs, many=True)
        orgdata = org_serializer.data
        is_localhost = request.get_host() == "127.0.0.1:8000" or request.get_host() == "localhost:8000"
        if is_localhost:
            for i in range(len(orgdata)):
                if orgdata[i]['image']:
                    orgdata[i]['image'] = "http://" + request.get_host() + orgdata[i]['image']
        members = Member.objects.filter(user__id=user_id)
        member_serializer = MemberSerializer(members, many=True)
        data = {"org": orgdata, "member": member_serializer.data}
        print(member_serializer.data)
        return Response(data)
        
