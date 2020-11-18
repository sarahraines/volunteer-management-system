import React from "react";
import NewOrg from "../pages/NewOrg";
import Settings from "../pages/Settings";
import Event from "../pages/Event";
import NewEvent from "../pages/NewEvent";


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
            return (<h1>Hello</h1>);
    }
  }
  
  export default FeedContent;