import React, {useState, useEffect, useCallback} from 'react';
import {Form, Typography, Calendar, Table} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";


const OrgFeedback = ({isAdmin, orgId}) => {

    const [info, setInfo] = useState([]); 

    const getFeedbackByOrg = useCallback(async () => {
        try {
            const response = await axiosAPI.get("eventFeedback/get-by-org/", {
                params: {
                    orgId: orgId,
                    isAdmin: isAdmin,
                    userId: localStorage.getItem("user_id"), 
                }
            });
            setInfo(response.data);
            console.log('response', response.data)
        } catch (error) {
            console.error(error);
        }
    }, [setInfo, orgId]);

    useEffect(() => {
        getFeedbackByOrg();
    }, [orgId]);

    const columns = [
    {
    title: 'Event Name',
    dataIndex: 'event__name',
    key: 'event__name',
    },
    {
    title: 'Event Location',
    dataIndex: 'event__location',
    key: 'event__location',
    },
    {
    title: 'Event Start Date',
    dataIndex: 'event__begindate',
    key: 'event__begindate',
    },
    {
    title: 'Event End Date',
    dataIndex: 'event__enddate',
    key: 'event__enddate',
    },
    {
    title: 'User Email',
    dataIndex: 'username__email',
    key: 'uesrname__email',
    },
    {
    title: 'User First Name',
    dataIndex: 'username__first_name',
    key: 'username__first_name',
    },
    {
    title: 'User Last Name',
    dataIndex: 'username__last_name',
    key: 'username__last_name',
    },
    {
    title: 'Overall',
    dataIndex: 'overall',
    key: 'overall',
    },
    {
    title: 'Satisfaction',
    dataIndex: 'satisfaction',
    key: 'satisfaction',
    },
    {
    title: 'Likely',
    dataIndex: 'likely',
    key: 'likely',
    },
    {
    title: 'Expectations',
    dataIndex: 'expectations',
    key: 'expectations',
    },
    {
    title: 'Future',
    dataIndex: 'future',
    key: 'future',
    },
    {
    title: 'Better',
    dataIndex: 'better',
    key: 'better',
    },
    {
    title: 'Experience',
    dataIndex: 'experience',
    key: 'experience',
    },
    ];

    return (
        <React.Fragment>
            <Typography.Title level={4}>Event Feedback</Typography.Title>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", overflowY: "scroll" }}>
            <Table dataSource={info} columns={columns}/>;
            </div>
        </React.Fragment>
    );
}; export default OrgFeedback;
