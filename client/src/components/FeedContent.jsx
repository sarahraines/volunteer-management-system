import React from "react";
import NewOrg from "../pages/NewOrg";
import Settings from "../pages/Settings";
import Event from "../pages/Event";
import NewEvent from "../pages/NewEvent";
import QAndAPage from "../pages/QAndAPage"


const FeedContent = ({context}) => {
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
            return <QAndAPage orgId={parseInt(context)}/>
    }
  }
  
  export default FeedContent;