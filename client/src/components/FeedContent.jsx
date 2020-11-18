import React from "react";
import NewOrg from "../pages/NewOrg";
import NewEvent from "../pages/NewEvent";
import QAndAPage from "../pages/QAndAPage"


const FeedContent = ({selectedKeys, context}) => {
    switch(context) {
        case "create-org":
            return (<NewOrg />);
        case "create-event":
            return (<NewEvent />);
        default:
            return <QAndAPage orgId={parseInt(selectedKeys[0])}/>
    }
  }
  
  export default FeedContent;