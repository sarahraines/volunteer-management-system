from .users import *
from .organization import *
from .event import *
from .member import *
from .clearance import *
from .analytics import *

class GetMemberCountsByOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        orgId = request.GET['orgId']
        members = Member.objects.filter(organization__id=orgId).values('member_type').annotate(Count('member_type'))
        members = list(members)

        y = [0, 0]

        for i in range(len(members)): 
            y[i] = members[i]['member_type__count'] 

        return Response(y, status=status.HTTP_200_OK)