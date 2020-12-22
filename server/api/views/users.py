from django.http import HttpResponse
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from api.serializers import UserSerializer, ChangePasswordSerializer, MyTokenObtainPairSerializer, MemberSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from api.models import User, Invitee, Member
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from api.tokens import account_activation_token
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger(__name__)

class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class CreateUser(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                is_active=False
            )
            current_site = 'localhost:3000'
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = account_activation_token.make_token(user)

            activation_url = f"http://{current_site}/activate?uid={uid}&token={token}"
            mail_subject = 'Activate your account.'
            message = render_to_string('activate_account.html', {
                'user': user,
                'activation_url': activation_url
            })
            email = EmailMessage(
                mail_subject, message, to=[data['email']]
            )
            email.send()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateUserFromInvite(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                is_active=True
            )
            logger.error(data)
            invite_id = data['invite_id']
            invite = get_object_or_404(Invitee, id=invite_id)
            logger.error(invite)
            member_data = {
                'user': user,
                'member_type': invite.member_type,
                'organization': invite.organization,
                'status': 0
            }
            member_serializer = MemberSerializer(data=member_data)
            if member_serializer.is_valid():
                Member.objects.create(
                    user=member_data['user'],
                    member_type=member_data['member_type'],
                    organization=member_data['organization'],
                    status=member_data['status']
                )
                invite.delete()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePassword(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = ChangePasswordSerializer(data=data)
        if serializer.is_valid():
            user = User.objects.get(pk=data['user_id'])
            if user.check_password(data['old_password']) : 
                user.set_password(data['new_password'])
                user.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.data, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class GetUser(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        user_id = request.GET.get('user_id')
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class ActivateUser(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        try:
            uidb64 = request.GET['uid']
            token = request.GET['token']
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response(None, status=status.HTTP_200_OK)
        else:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class ForgotPassword(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        if request.GET.get('user_id'):
            try:
                user = User.objects.get(pk=request.GET['user_id'])
            except:
                return Response(None, status=status.HTTP_200_OK)
        elif request.GET.get('email'):
            try:
                user = User.objects.get(email=request.GET['email'])
            except:
                user = None
        
        if user is not None:
            current_site = 'localhost:3000'
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = account_activation_token.make_token(user)

            password_reset_url = f"http://{current_site}/reset-password?uid={uid}&token={token}"
            mail_subject = 'Reset your password.'
            message = render_to_string('reset_password.html', {
                'user': user,
                'password_reset_url': password_reset_url
            })
            email = EmailMessage(
                mail_subject, message, to=[user.email]
            )
            email.send()
            return Response(None, status=status.HTTP_200_OK)
        return Response("There was ", status=status.HTTP_400_BAD_REQUEST) 


class UpdateUser(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        user = User.objects.get(pk=data['user_id'])
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
