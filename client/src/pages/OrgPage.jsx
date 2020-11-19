import React, {useState, useEffect, useCallback} from 'react';
import { Layout, Typography, Form } from 'antd';
import './NewOrg.css';
import QAndAPage from './QAndAPage';
import EventCard from '../components/EventCard';
import axiosAPI from '../api/axiosApi';

function OrgPage({orgId}) {
    
    const [org, setOrg] = useState(null);
    const [eventsByOrg, setEventsByOrg] = useState([]);

    const getOrgInfo = useCallback(async () => {
        try {
            const response = await axiosAPI.get("organization/get-info/", {
                params: {
                    orgId: orgId
                }
            });
            setOrg(response.data)
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    const getEventsByOrg = useCallback(async () => {
        try {
            const response = await axiosAPI.get("events/get-by-org/", {
                params: {
                    orgId: orgId
                }
            });
            setEventsByOrg(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        getOrgInfo();
        getEventsByOrg();
    }, [orgId, getEventsByOrg, getOrgInfo]);

    const eventList = eventsByOrg.map(item => 
        <EventCard key={item.id} item={item} />
    );

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Content className="org-content">
                {org != null &&
                    <>
                    <Typography.Title level={2}>{org.name}</Typography.Title>
                    Organization Causes: 
                    {org.causes.map(c => 
                        <Typography.Paragraph level={2}>{c.name}</Typography.Paragraph>
                    )}
                    Organization Description:
                    <Typography.Paragraph level={2}>{org.description}</Typography.Paragraph>
                    </>
                }
                    <QAndAPage orgId={orgId} />

                <Typography.Title level={4}>Find service opportunities</Typography.Title>
            <Form
                name="attendee"
                className="attendee-form"
                initialValues={{ remember: true }}
            >
                {eventList}
            </Form>
           
        </Layout.Content>
    </Layout>
    );
    
};


export default OrgPage;