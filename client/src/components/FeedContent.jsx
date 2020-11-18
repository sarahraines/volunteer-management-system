import React from "react";
import NewOrg from "../pages/NewOrg";
import NewEvent from "../pages/NewEvent";


const FeedContent = ({context}) => {
    switch(context) {
        case "create-org":
            return (<NewOrg />);
        case "create-event":
            return (<NewEvent />);
        default:
            return (<h1>Hello</h1>);
    }
  }
  
  export default FeedContent;