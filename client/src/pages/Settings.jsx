import React from "react";
import ProfileSettings from "../pages/ProfileSettings";
import { Tabs, Typography } from 'antd';

const { TabPane } = Tabs;

const Settings = () => (
    <React.Fragment>
        <Typography.Title level={4}>Manage user settings</Typography.Title>
        <Tabs defaultActiveKey="1">
            <TabPane tab="Profile" key="1">
                <ProfileSettings />
            </TabPane>
            <TabPane tab="Account" key="2">
                Content 2
            </TabPane>
            <TabPane tab="Notifications" key="3">
                Content 3
            </TabPane>
        </Tabs>
    </React.Fragment>
);

export default Settings;