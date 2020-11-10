import React from "react";
import NewOrg from "../pages/NewOrg";
import Settings from "../pages/Settings";
import Event from "../pages/Event";


const FeedContent = ({context}) => {
    switch(context) {
        case "create":
            return (<NewOrg />);
        case "find":
            return (<Event />);
        case "settings":
            return (<Settings />);
        default:
            return (<h1>Hello</h1>);
    }
  }
  
  export default FeedContent;