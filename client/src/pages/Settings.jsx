import React from "react";
import ProfileSettings from "../pages/ProfileSettings";
import SecuritySettings from "../pages/SecuritySettings";
import UserNotifications from "../pages/UserNotifications";
import { usePageView } from '../utils/googleAnalytics'
import { Tabs, Typography } from 'antd';

const { TabPane } = Tabs;

const Settings = () => {
    usePageView('/settings')
    return (
        <React.Fragment>
            <Typography.Title level={3}>Manage user settings</Typography.Title>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Profile" key="1">
                    <ProfileSettings />
                </TabPane>
                <TabPane tab="Security" key="2">
                    <SecuritySettings />
                </TabPane>
                <TabPane tab="Notifications" key="3">
                    <UserNotifications />
                </TabPane>
            </Tabs>
        </React.Fragment>
    );
}

export default Settings;