import React, {useState, useEffect, useCallback} from 'react';
import {Typography, Table, Input} from 'antd';
import "antd/dist/antd.css";
import axiosAPI from "../api/axiosApi";

const { Search } = Input;

const OrgFeedback = ({isAdmin, orgId}) => {

    const [info, setInfo] = useState([]); 
    const [filterDisplay, setFilterDisplay] = useState([]);

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
            setFilterDisplay(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [orgId, isAdmin]);

    useEffect(() => {
        getFeedbackByOrg();
    }, [orgId]);

    const handleChange = e => {
        let oldList = info;
        if (e !== "") {
            let newList = [];
            newList = oldList.filter(feedback =>
                feedback.event__name.toLowerCase().includes(e.toLowerCase()) || 
                feedback.name.toLowerCase().includes(e.toLowerCase())
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(oldList);
        }
    };

    const columns = [
    {
    title: 'Event Name',
    dataIndex: 'event__name',
    key: 'event__name',
    sorter: (a, b) => a.event__name.localeCompare(b.event__name),
    },
    {
    title: 'Volunteer Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
    title: 'Volunteer Email',
    dataIndex: 'username__email',
    key: 'username__email',
    sorter: (a, b) => a.username__email.localeCompare(b.username__email),
    },
    {
    title: 'Overall Experience',
    dataIndex: 'overall',
    key: 'overall',
    filters: [
        {
            text: 'Poor',
            value: 'Poor',
        },
        {
            text: 'Fair',
            value: 'Fair',
        },
        {
            text: 'Average',
            value: 'Average',
        },
        {
            text: 'Good',
            value: 'Good',
        },
        {
            text: 'Excellent',
            value: 'Excellent',
        },
        ],
            filterMultiple: true,
            onFilter: (value, record) => record.overall === value,
    },
    {
    title: 'Satisfaction',
    dataIndex: 'satisfaction',
    key: 'satisfaction',
    filters: [
        {
            text: 'Very Dissatisfed',
            value: 'Very Dissatisfied',
        },
        {
            text: 'Dissatisfied',
            value: 'Dissatisfied',
        },
        {
            text: 'Neutral',
            value: 'Neutral',
        },
        {
            text: 'Satisfied',
            value: 'Satisfied',
        },
        {
            text: 'Very Satisfied',
            value: 'Very Satisfied',
        },
        ],
        filterMultiple: true,
        onFilter: (value, record) => record.satisfaction === value,
    },
    {
    title: 'Recommend Likelihood',
    dataIndex: 'likely',
    key: 'likely',
    filters: [
        {
            text: 'Very Unlikely',
            value: 'Very Unlikely',
        },
        {
            text: 'Somewhat Unlikely',
            value: 'Somewhat Unlikely',
        },
        {
            text: 'Neutral',
            value: 'Neutral',
        },
        {
            text: 'Somewhat Likely',
            value: 'Somewhat Likely',
        },
        {
            text: 'Very Likely',
            value: 'Very Likely',
        },
        ],
        filterMultiple: true,
        onFilter: (value, record) => record.likely === value,
    },
    {
    title: 'Met Expectations',
    dataIndex: 'expectations',
    key: 'expectations',
    filters: [
        {
            text: 'Yes',
            value: 'Yes',
        },
        {
            text: 'No',
            value: 'No',
        },
        ],
        filterMultiple: true,
        onFilter: (value, record) => record.expectations === value,
    },
    {
    title: 'Future Volunteer',
    dataIndex: 'future',
    key: 'future',
    filters: [
        {
            text: 'Yes',
            value: 'Yes',
        },
        {
            text: 'No',
            value: 'No',
        },
        ],
        filterMultiple: true,
        onFilter: (value, record) => record.future === value,
    },
    ];

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <React.Fragment>
            <Typography.Title level={4}>Event Feedback</Typography.Title>
            <Search placeholder="search by event or volunteer" onChange={e => handleChange(e.target.value)} style={{ width: 300, marginBottom: 16 }}  />
            <Table 
            dataSource={filterDisplay} 
            columns={columns}
            expandedRowRender= {record =>
                <p>
                    <b>Event Details</b><br/>
                    Name: {record.event__name}<br/>
                    Location: {record.event__location}<br/>
                    Date: {(new Date(record.event__begindate)).toLocaleString('en-US', options)} - {(new Date(record.event__enddate)).toLocaleString('en-US', options)}<br/><br/>
                    <b>Additional Feedback</b><br/>
                    What could we have done better?<br/>
                    {record.better}<br/><br/>
                    Is there anything else we should know about your volunteer experience?<br/>
                    {record.experience}<br/>
                </p>
            }        
            />
        </React.Fragment>
    );
}; export default OrgFeedback;
