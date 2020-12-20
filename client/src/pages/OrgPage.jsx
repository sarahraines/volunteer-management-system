import React, {useState, useEffect} from 'react';
import { Typography, Tabs } from 'antd';
import QAndAPage from './QAndAPage';
import OrgEvents from './OrgEvents';
import AboutUs from './AboutUs';
import "./OrgPage.css";

const { Title } = Typography;
const { TabPane } = Tabs;

function OrgPage({member, orgId}) {
    const [org, setOrg] = useState(null);
    const [activeKey, setActiveKey] = useState("home");

    useEffect(() => {
        if (orgId) {
            if (member) {
                setOrg(member.organization);
            }
            setActiveKey("home")
        }
    }, [setActiveKey, orgId, member]);

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
                    <QAndAPage isAdmin={member?.member_type} orgId={orgId} />
                </TabPane>
            </Tabs>
        </React.Fragment>
    );
    
};


export default OrgPage;