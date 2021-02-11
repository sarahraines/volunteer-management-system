import React, {useState, useEffect} from 'react';
import { Typography, Tabs } from 'antd';
import QAndAPage from './QAndAPage';
import OrgEvents from './OrgEvents';
import AboutUs from './AboutUs';
import MemberPage from './MemberPage';
import OrgFeedback from './OrgFeedback'; 
import Analytics from './Analytics'; 
import InvitePage from './InvitePage'; 
import Clearances from './Clearances';
import OrgClearanceTable from './OrgClearanceTable'
import NewEmail from './NewEmail'
import "./OrgPage.css";

const { Title } = Typography;
const { TabPane } = Tabs;

function OrgPage({member, orgId}) {
    const [org, setOrg] = useState(null);
    const [activeKey, setActiveKey] = useState("home");
    const isAdmin = member?.member_type === 1;

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
                {isAdmin &&
                     <TabPane tab="Members" key="members">
                        <MemberPage orgId={orgId} />
                    </TabPane>
                }
                {isAdmin &&
                     <TabPane tab="Invites" key="invites">
                        <InvitePage orgId={orgId} />
                    </TabPane>
                }
                {isAdmin &&
                    <TabPane tab="Communication" key="member_emails">
                        <NewEmail orgId={orgId} />
                    </TabPane> 
                }
            </Tabs>
        </React.Fragment>
    );
    
};


export default OrgPage;