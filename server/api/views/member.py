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
from request_token.models import RequestToken
from request_token.decorators import use_request_token
from jwt.exceptions import InvalidSignatureError, DecodeError
from rest_framework.decorators import api_view
import logging

logger = logging.getLogger(__name__)

class CreateMember(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        user = User.objects.filter(id=request.data.get('user_id'))[0]
        print(Organization.objects.filter(name=request.data.get('organization')).values('name'))
        print(request.data.get('organization'))
        organization = Organization.objects.filter(name=request.data.get('organization'))[0]
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
        return Response(serializer.data)

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
                invitee, _ = Invitee.objects.update_or_create(
                    email=address,
                    organization=organization,
                    defaults={
                        "member_type": member_type,
                        "status": 10
                    }
                )
                current_site = 'localhost:3000'
                token = RequestToken.objects.create_token(
                    scope="invitation",
                    login_mode=RequestToken.LOGIN_MODE_NONE,
                    data={
                        'iid': invitee.id
                    }
                )

                activation_url = f"http://{current_site}/invite?rt={token.jwt()}"
                mail_subject = 'You\'ve been invited!'
                from_email = 'vol.mgmt.system@gmail.com'
                message = render_to_string('invite_organization.html', {
                    'organization': organization.name,
                    'activation_url': activation_url
                })
                email = (mail_subject, message, from_email, [address])

                emails.append(email)
        send_mass_mail(emails)
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
        token = get_object_or_404(RequestToken, data__iid=int(invite_id))
        token.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@use_request_token(scope="invitation")
def validate_invite(request):
    if request.token:
        token = request.token
        invite_id = token.data['iid']
        token.delete()
        invite = Invitee.objects.get(pk=invite_id)
        serialized_invite = InviteeSerializer(invite)
        user = User.objects.filter(email=invite.email).first()
        serialized_user = UserSerializer(user)
        data = {
            "user": serialized_user.data,
            "invite": serialized_invite.data
        }
        return Response(data, status=status.HTTP_200_OK)
    return Response(None, status=status.HTTP_403_FORBIDDEN)

class RejectInvite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def delete(self, request):
        invite_id = request.GET.get('invite_id')
        invite = get_object_or_404(Invitee, id=invite_id)
        invite.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class AcceptInvite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def post(self, request):
        data = request.data
        user_id = data['user_id']
        invite_id = data['invite_id']
        user = get_object_or_404(User, id=user_id)
        invite = get_object_or_404(Invitee, id=invite_id)
        member_data = {
            'user': user,
            'member_type': invite.member_type,
            'organization': invite.organization,
            'status': 0
        }
        serializer = MemberSerializer(data=member_data)
        if serializer.is_valid():
            Member.objects.create(
                user=member_data['user'],
                member_type=member_data['member_type'],
                organization=member_data['organization'],
                status=member_data['status']
            )
            invite.delete()
            return Response(None, status=status.HTTP_201_CREATED)
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