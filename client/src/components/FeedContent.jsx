import React from "react";
import NewOrg from "../pages/NewOrg";
import NewEvent from "../pages/NewEvent";
import OrgPage from "../pages/OrgPage"


const FeedContent = ({selectedKeys, context}) => {
    switch(context) {
        case "create-org":
            return (<NewOrg />);
        case "create-event":
            return (<NewEvent />);
        default:
            return <OrgPage orgId={parseInt(selectedKeys)}/>
    }
  }
  
  export default FeedContent;