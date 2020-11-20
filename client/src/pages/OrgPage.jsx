import React, {useState, useEffect, useCallback} from 'react';
import { Typography, Form, Tabs } from 'antd';
import QAndAPage from './QAndAPage';
import axiosAPI from '../api/axiosApi';
import OrgEvents from './OrgEvents';
import AboutUs from './AboutUs';
import "./OrgPage.css";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

function OrgPage({orgId}) {
    const [org, setOrg] = useState(null);
    const [activeKey, setActiveKey] = useState("home");

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

    useEffect(() => {
        if (orgId) {
            getOrgInfo();
            setActiveKey("home")
        }
    }, [orgId, getOrgInfo]);

    return (
        <React.Fragment>
            {org && <Title style={{ textAlign: "center" }} level={2}>{org.name}</Title>}
            <Tabs activeKey={activeKey} onChange={setActiveKey} style={{ height: "100%" }}>
                <TabPane tab="Home" key="home" style={{ height: "100%" }}>
                    <AboutUs org={org} />
                </TabPane>
                <TabPane tab="Events" key="events">
                    <OrgEvents orgId={orgId} />
                </TabPane>
                <TabPane tab="FAQ" key="faq">
                    <QAndAPage orgId={orgId} />
                </TabPane>
            </Tabs>
        </React.Fragment>
    );
    
};


export default OrgPage;