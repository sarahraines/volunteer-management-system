from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import MemberSerializer, OrganizationSerializer, InviteeSerializer, UserSerializer
from api.models import Organization, Cause, Member, User, Invitee
from django.shortcuts import get_object_or_404
from django.core.mail import send_mass_mail, send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from api.tokens import account_activation_token
from request_token.decorators import use_request_token
from jwt.exceptions import InvalidSignatureError, DecodeError
from rest_framework.decorators import api_view
from django.conf import settings
import logging
import jwt
from django.forms.models import model_to_dict

logger = logging.getLogger(__name__)

class CreateMember(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        user = User.objects.get(pk=request.data.get('user_id'))
        organization = Organization.objects.get(pk=request.data.get('org_id'))
        data = {
            'member_type': request.data.get('member_type'),
            'status': request.data.get('status')
        }
        serializer = MemberSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=user, organization=organization)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetMemberFromUser(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request):
        user_id = request.GET['user_id']
        members = Member.objects.filter(user=user_id)
        serializer = MemberSerializer(members, many=True)

        data = serializer.data
        is_localhost = request.get_host() == "127.0.0.1:8000" or request.get_host() == "localhost:8000"
        if is_localhost:
            for member in data:
                if member.get('organization', {}).get('image'):
                    member['organization']['image'] = "http://" + request.get_host() + member['organization']['image']

   
        return Response(data)

class GetOrgsFromMember(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        user_id = request.GET['user_id']
        organizations = Organization.objects.filter(member__user=user_id)
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data)

class DeleteMember(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def delete(self, request):
        member_id = request.GET.get('member_id')
        member = get_object_or_404(Member, id=member_id)
        member.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class DeleteMemberFromUser(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def delete(self, request):
        user_id = request.GET.get('user_id')
        org_id = request.GET.get('org_id')
        member = get_object_or_404(Member, user__id=user_id, organization__id=org_id)
        member.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class InviteMembers(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        emails = []
        data = request.data
        email_addresses = data['emails']
        member_type = data['member_type']
        org_id = data['org_id']
        organization = Organization.objects.get(pk=org_id)
        for address in email_addresses:
            invitee_data = {
                'email': address,
                'member_type': member_type,
                'organization': organization,
                'status': 10
            }
            serializer = InviteeSerializer(data=invitee_data)
            if serializer.is_valid():
                invitee, _ = Invitee.objects.update_or_create(invitee_data)
                token = jwt.encode({'invite_id': invitee.id}, settings.SECRET_KEY, algorithm='HS256')
                is_localhost = request.get_host() == "127.0.0.1:8000" or request.get_host() == "localhost:8000" 
                activation_url = request.build_absolute_uri(f"/invite?rt={token}") if not is_localhost else f"http://localhost:3000/invite?rt={token}"
                mail_subject = 'You\'ve been invited!'
                from_email = 'vol.mgmt.system@gmail.com'
                message = render_to_string('invite_organization.html', {
                    'organization': organization.name,
                    'activation_url': activation_url
                })
                email = (mail_subject, message, from_email, [address])
                emails.append(email)

        send_mass_mail(emails, fail_silently=False)
        return Response(None, status=status.HTTP_201_CREATED)


class GetInvitesByOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        invites = Invitee.objects.filter(organization__id=org_id)
        serializer = InviteeSerializer(invites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteInvite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def delete(self, request):
        invite_id = request.GET.get('invite_id')
        invite = get_object_or_404(Invitee, id=invite_id)
        invite.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class ValidateInvite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        try:
            tokendata = jwt.decode(request.GET['rt'], settings.SECRET_KEY, algorithms=["HS256"])
            _invite_id = tokendata['invite_id']
        except:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return Response(None, status=status.HTTP_200_OK)
        
class RejectInvite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        try:
            tokendata = jwt.decode(request.GET['rt'], settings.SECRET_KEY, algorithms=["HS256"])
            invite_id = tokendata['invite_id']
        except:
            return Response(status=status.HTTP_403_FORBIDDEN)
        invite = get_object_or_404(Invitee, id=invite_id)
        invite.status = 12
        invite.save()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class AcceptInvite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        try:
            tokendata = jwt.decode(request.GET['rt'], settings.SECRET_KEY, algorithms=["HS256"])
            invite_id = tokendata['invite_id']
        except:
            return Response(status=status.HTTP_403_FORBIDDEN)

        invite = get_object_or_404(Invitee, id=invite_id)
        user = get_object_or_404(User, email=invite.email)

        member_data = {
            'user': user,
            'member_type': invite.member_type,
            'organization': invite.organization,
            'status': 0
        }
        logger.error(member_data)
        serializer = MemberSerializer(data=member_data)
        if serializer.is_valid():
            Member.objects.create(**member_data)
            invite.delete()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailMembers(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        subject = data['subject']
        body = data['body']
        members = data['membersList']
        email_list = []
        for member in members:
            email_list.append(member['user']['email'])
        print(email_list)

        send_mail(subject, body, 'vol.mgmt.system@gmail.com', email_list, fail_silently=False)

        return Response(None, status=status.HTTP_200_OK)