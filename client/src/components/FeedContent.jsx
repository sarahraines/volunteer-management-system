import React from "react";
import NewOrg from "../pages/NewOrg";
import Settings from "../pages/Settings";
import NewEvent from "../pages/NewEvent";
import OrgPage from "../pages/OrgPage"
import VolunteerAnalytics from "../pages/VolunteerAnalytics"
import VolunteerCalendar from "../pages/VolunteerCalendar"
import NewGoal from "../pages/NewGoal"


const FeedContent = ({member, context}) => {
    switch(context) {
        case "create-org":
            return (<NewOrg />);
        case "settings":
            return (<Settings />);
        case "create-event":
            return (<NewEvent />);
        case "set-goals":
            return (<NewGoal />);
        case "calendar":
            return (<VolunteerCalendar />); 
        case "view-analytics":
            return (<VolunteerAnalytics />); 
        default:
            const orgId = parseInt(context)
            if (isNaN(orgId)) {
                return (<NewOrg />);
            } else {
                const orgMember = member.filter(m => m.organization.id === orgId)[0]
                return <OrgPage member={orgMember} orgId={orgId}/>
            } 
    }
  }
  
  export default FeedContent;