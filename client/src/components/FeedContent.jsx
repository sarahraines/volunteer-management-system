import React from "react";
import NewOrg from "../pages/NewOrg";
import Settings from "../pages/Settings";
import Event from "../pages/Event";
import NewEvent from "../pages/NewEvent";
import OrgPage from "../pages/OrgPage"


const FeedContent = ({member, context}) => {
    switch(context) {
        case "create-org":
            return (<NewOrg />);
        case "find":
            return (<Event />);
        case "settings":
            return (<Settings />);
        case "create-event":
            return (<NewEvent />);
        default:
            const orgId = parseInt(context)
            const orgMember = member.filter(m=>m.organization.id == orgId)[0]
            return <OrgPage member={orgMember} orgId={orgId}/>
    }
  }
  
  export default FeedContent;