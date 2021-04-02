from django.http import HttpResponse
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from api.serializers import UserSerializer, ChangePasswordSerializer, MyTokenObtainPairSerializer, MemberSerializer, UserSettingsSerializer, UserGoalsSerializer, ResetPasswordSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from api.models import User, Invitee, Member, UserSettings, UserGoals, Attendee, Event, Change, EventFeedback, OrgFile, UserFile
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from api.tokens import account_activation_token
from django.shortcuts import get_object_or_404
from django.conf import settings
import hashlib
import logging
import jwt
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import F
from collections import defaultdict

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
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = account_activation_token.make_token(user)
            is_localhost = request.get_host() == "127.0.0.1:8000" or request.get_host() == "localhost:8000" 
            activation_url = request.build_absolute_uri(f"/activate?uid={uid}&token={token}") if not is_localhost else f"http://localhost:3000/activate?uid={uid}&token={token}"
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
                Member.objects.create(**member_data)
                invite.delete()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ValidateResetPassword(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        try:
            tokendata = jwt.decode(request.GET['rt'], settings.SECRET_KEY, algorithms=["HS256"])
            user_id = tokendata['user_id']
            token = tokendata['token']
            user = User.objects.get(pk=user_id)
            hashed_old_password = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
            if hashed_old_password != token:
                return Response("Invalid password reset request", status=status.HTTP_403_FORBIDDEN)
        except jwt.ExpiredSignatureError:
            return Response("Password reset request expired", status=status.HTTP_403_FORBIDDEN)
        except:
            return Response("Invalid password reset request", status=status.HTTP_403_FORBIDDEN)
        return Response(None, status=status.HTTP_200_OK)

class ResetPassword(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        try:
            tokendata = jwt.decode(data['rt'], settings.SECRET_KEY, algorithms=["HS256"])
            user_id = tokendata['user_id']
            token = tokendata['token']
        except jwt.ExpiredSignatureError:
            return Response("Password reset request expired", status=status.HTTP_403_FORBIDDEN)
        except:
            return Response("Invalid password reset request", status=status.HTTP_403_FORBIDDEN)

        user = User.objects.get(pk=user_id)
        hashed_old_password = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
        if hashed_old_password == token:
            serializer = ResetPasswordSerializer(data=data)
            if serializer.is_valid():
                user.set_password(data['new_password'])
                user.save()
                return Response("New password set", status=status.HTTP_200_OK)
            return Response("New password invalid", status=status.HTTP_400_BAD_REQUEST)
        return Response("Invalid password reset request", status=status.HTTP_403_FORBIDDEN)


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

    def post(self, request, format='json'):
        data = request.data
        try:
            user = User.objects.get(email=data['email'])
        except:
            user = None
        
        if user is not None:
            token = jwt.encode({
                'user_id': user.id,
                'token': hashlib.sha256(user.password.encode('utf-8')).hexdigest()
            }, settings.SECRET_KEY, algorithm='HS256')
            is_localhost = request.get_host() == "127.0.0.1:8000" or request.get_host() == "localhost:8000" 
            password_reset_url = request.build_absolute_uri(f"/reset-password?rt={token}") if not is_localhost else f"http://localhost:3000/reset-password?rt={token}"
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

class SubmitNotificationSettings(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        keys = data.keys()

        if 'email' not in keys:
            data['email'] = False
        if 'text' not in keys:
            data['text'] = False
        if 'phone_number' not in keys:
            data['phone_number'] = ""

        exists = UserSettings.objects.filter(user__id=data['user_id']).values('id')
        user = User.objects.get(pk=data['user_id'])

        if(len(exists) != 0):
            id = exists[0]['id']
            UserSettings.objects.update(id=id, user=user, email=data['email'], text=data['text'], phone_number=data['phone_number'])
            return Response(data, status=status.HTTP_200_OK)
        else:
            UserSettings.objects.create(user=user, email=data['email'], text=data['text'], phone_number=data['phone_number'])
            return Response(data, status=status.HTTP_201_CREATED)
         
class GetNotificationSettings(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        exists = UserSettings.objects.filter(user__id=request.GET['user_id']).values('email', 'text', 'phone_number')

        if(len(exists) != 0):
            return Response(exists[0], status=status.HTTP_200_OK)
        else:
            data = [
                {
                    "email": True,
                    "text": False,
                    "phone_number": ''
                },
            ]
            return Response(data[0], status=status.HTTP_200_OK)

class CreateGoal(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = UserGoalsSerializer(data=data)
        user = User.objects.filter(id=data['user_id'])[0]
        data['begindate']=data['date'][0].split('T')[0]
        data['enddate']=data['date'][1].split('T')[0]
        serializer = UserGoalsSerializer(data=data)
        print(data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GenerateDailyReport(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, format='json'):
        data = request.GET
        user_id = data['user_id']

        # The time after which updates will be considered
        start_datetime = timezone.now() - timedelta(days=1)

        # Changes to event date/location.
        attendee = Attendee.objects.filter(username=user_id, events__begindate__gt=timezone.now()).first()

        event_changes = {}
        if attendee is not None:
            future_events = attendee.events.filter(begindate__gt=timezone.now()).all()
            future_events = {event.id: event for event in future_events}

            for column in ['location', 'begindate', 'enddate']:
                changes = Change.objects.filter(model='Event', column=column, created_at__gt=start_datetime, object_id__in=list(future_events)).order_by('created_at')
                for change in changes:
                    if change.object_id in event_changes and f'old_{column}' in event_changes[change.object_id]:
                        continue

                    delta = event_changes.setdefault(change.object_id, {})
                    delta[f'old_{column}'] = change.old_value


            for event_id, delta in event_changes.copy().items():
                event = future_events[event_id]

                for column in ['location', 'begindate', 'enddate']:
                    if f'old_{column}' in delta and str(getattr(event, column)) == delta[f'old_{column}']:
                        del delta[f'old_{column}']
                    elif  f'old_{column}' in delta:
                        delta[f'new_{column}'] = str(getattr(event, column))
                
                if not delta:
                    del event_changes[event_id]
                else:
                    delta['name'] = event.name
                    delta['id'] = event.id

        # Clearances for events in which they are an attendee.
        if attendee is not None:
            new_clearances = OrgFile.objects.filter(created_at__gt=start_datetime, event__name__in=[event.name for event in attendee.events.all()])
            new_clearances = [{
                'org_id': c.organization.id,
                'org_name': c.organization.name,
                'event_name': c.event.name,
            } for c in new_clearances]

            new_clearances_final = defaultdict(set)
            for c in new_clearances:
                new_clearances_final[c['org_id']].add((c['org_name'], c['event_name']))

            out = {}
            for item in new_clearances_final:
                out[item] = [{'org_name': c[0], 'event_name': c[1]} for c in new_clearances_final[item]]
            
            new_clearances_final = out
            
        else:
            new_clearances_final = []

        # Clearance status changes for clearances they uploaded.
        my_files = UserFile.objects.filter(user__id=user_id).all()
        my_files = {file.id: file for file in my_files}
        my_changed_files = Change.objects \
            .filter(model='UserFile', column='status', created_at__gt=start_datetime, object_id__in=list(my_files)) \
            .order_by('created_at')

        changed_clearances = defaultdict(list)
        for change in my_changed_files:
            if change.old_value != my_files[change.object_id]:
                if change.object_id in changed_clearances:
                    continue

                event_id = my_files[change.object_id].org_file.event.id
                changed_clearances[event_id].append({
                    'id': change.object_id,
                    'event_name': my_files[change.object_id].org_file.event.name,
                    'old_status': change.old_value,
                    'new_status': my_files[change.object_id].status,
                })

        # Any new clearances uploaded by members (organization admin only).
        admin_members = Member.objects.filter(member_type=1, status=0).all()
        admin_orgs = {member.organization.id: member.organization for member in admin_members}
        
        uploaded_clearances = {}
        for admin_org_id, admin_org in admin_orgs.items():
            count = UserFile.objects.filter(created_at__gt=start_datetime, status='Pending', org_file__organization__id=admin_org_id).count()

            if count > 0:
                uploaded_clearances[admin_org_id] = {
                    'id': admin_org_id,
                    'org_name': admin_org.name,
                    'uploaded_clearances_count': count,
                }

        # Any new feedback forms (and remind them of old, unfilled ones).
        past_attendees = Attendee.objects.filter(username=user_id, events__enddate__gt=start_datetime, events__enddate__lt=timezone.now()).first().events.all()
        past_events = [{'id': event.id, 'event_name': event.name, 'org_name': event.organization.name} for event in past_attendees]

        return Response({
            "events": list(event_changes.values()), 
            "new_clearances": new_clearances_final,
            "changed_clearances": changed_clearances,
            "uploaded_clearances": uploaded_clearances,
            "feedback": past_events, 
        }, status=status.HTTP_200_OK)
