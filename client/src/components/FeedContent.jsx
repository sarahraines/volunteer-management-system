import React, { useState } from "react";
import NewOrg from "../pages/NewOrg";


const FeedContent = ({context}) => {
    switch(context) {
        case "create":
            return (<NewOrg />);
        default:
            return (<h1>Hello</h1>);
    }
  }
  
  export default FeedContent;