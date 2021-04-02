import React from 'react';
import { Carousel } from 'antd';

function Tutorial() {

    const contentStyle = {
        height: '160px',
        color: '#fff',
        background: '#364d79',
        padding: '20px'
    };

    return (
        <React.Fragment>      
            <Carousel>
                <div>
                    <p style={contentStyle}>
                        <b><center>Create and Access Organizations</center></b><br/>
                        If you are a nonprofit admin, click "Create Organization" under the "Take Action" dropdown in the application sidebar. 
                        Click on an organization from the sidebar of the application. 
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Invite Members</center></b><br/>
                        If you are a nonprofit admin, send email invites to members of your nonprofit by clicking the "Invite New Members" 
                        button on the "Invites" tab of the organization page.
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Create Events</center></b><br/>
                        If you are a nonprofit admin, click "Create Event" under the "Take Action" dropdown in the application sidebar.
                        Created events will be displayed in the "Events" tabs of the organization page.
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>View Events</center></b><br/>
                        View upcoming events, join events, and filter and search for different events on the "Events" tab of
                        the organization page. Click "View More" on any event card to view full event details. 
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Upload Clearances</center></b><br/>
                        On the "Clearances" tab of the organization page, admins  upload blank clearances. Volunteers  upload completed clearances.
                        Admins accept or reject uploaded clearances and write comments. 
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Set and View Goals</center></b><br/>
                        Set and view volunteering hours goals within a specific duration by clicking on the "Set Goals" option 
                        under the "Take Action" dropdown in the application sidebar.
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>View My Events</center></b><br/>
                        View upcoming events you are registered for and goals you have set in a calendar view by clicking "View my events" under the
                        "Take Action" dropdown in the application sidebar. 
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Feedback</center></b><br/>
                        By clicking on the "Feedback" tab of the organization page, view feedback you have given on prior events or view feedback given
                        by all volunteers if you are a nonprofit admin. 
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Analytics</center></b><br/>
                        If you are a nonporofit admin, view analytics for your organization on the "Analytics" tab of the organization page.
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>View my analytics</center></b><br/>
                        View personal analytics including hours volunteered, events attended and top rated events by clicking the "View my analytics" option
                        under the "Take Action" dropdown in the application sidebar. 
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>FAQ</center></b><br/>
                        Post questions if you are a volunteer or post and answer questions if you are a nonprofit admin on the "FAQ" tab of the organization page.
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Members</center></b><br/>
                        If you are a nonprofit admin, view all members of your organization and delete members on the "Members" tab of the organization page.
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Communication</center></b><br/>
                        If you are a nonprofit admin, select any group of members from your organization and send them an email on the "Communication" tab of the organization page.
                    </p>
                </div>
                <div>
                    <p style={contentStyle}>
                        <b><center>Manage User Settings</center></b><br/>
                        Change profile information, reset your password and change notification settings by clicking "Manage User Settings" on the sidebar.
                    </p>
                </div>
                
            </Carousel>
        </React.Fragment>
    )


} export default Tutorial;

