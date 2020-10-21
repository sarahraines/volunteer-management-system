from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from api.serializers import EventSerializer, CauseSerializer
from api.models import Event, Cause
import logging
import datetime

logger = logging.getLogger(__name__)

class CreateEvent(APIView):
	permission_classes = (permissions.AllowAny,)

	def post(self, request, format='json'):
		data = request.data
		# serializer = EventSerializer(data=data)
		# if serializer.is_valid():
		# 	serializer.save()
		# 	return Response(serializer.data, status=status.HTTP_201_CREATED)
		# print(serializer.errors)
		# return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		new_event = Event(
			name=data['name'], 
			virtual=data['virtual'], 
			location=data['location'], 
			begindate=data['date'][0], 
			enddate=data['date'][1],
			description=data['description'])
		new_event.save()
		return Response(data, status=status.HTTP_201_CREATED)

class GetCauses(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        causes = Cause.objects.all()
        serializer = CauseSerializer(causes, many=True)
        return Response(serializer.data)