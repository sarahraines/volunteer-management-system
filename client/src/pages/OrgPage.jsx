import React, {useState, useEffect, useCallback} from 'react';
import { Typography, Form, Tabs } from 'antd';
import QAndAPage from './QAndAPage';
import axiosAPI from '../api/axiosApi';
import OrgEvents from './OrgEvents';
import AboutUs from './AboutUs';
import OrgFeedback from './OrgFeedback'; 
import Analytics from './Analytics'; 
import Clearances from './Clearances';
import OrgClearanceTable from './OrgClearanceTable'
import "./OrgPage.css";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

function OrgPage({member, orgId}) {

    const [org, setOrg] = useState(null);
    const [activeKey, setActiveKey] = useState("home");

    const setMemberInfo = () => {
        if(member){
            setOrg(member.organization);
        }
    }

    useEffect(() => {
        if (orgId) {
            setMemberInfo();
            setActiveKey("home")
        }
    }, [orgId]);
    const isAdmin = member?.member_type

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
                    <QAndAPage isAdmin={isAdmin} orgId={orgId} />
                </TabPane>
                <TabPane tab="Feedback" key="feedback">
                    <OrgFeedback isAdmin={member?.member_type} orgId={orgId} />
                </TabPane>
                <TabPane tab="Analytics" key="analytics">
                    <Analytics orgId={orgId} />
                </TabPane>
                <TabPane tab="Clearances" key="clearance">
                    <Clearances isAdmin={isAdmin} orgId={orgId} />
                </TabPane>
                {isAdmin &&
                    <TabPane tab="Clearance Table" key="clearance_table">
                        <OrgClearanceTable orgId={orgId} />
                    </TabPane> 
                }
                
            </Tabs>
        </React.Fragment>
    );
    
};


export default OrgPage;