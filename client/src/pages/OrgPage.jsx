import React, {useState, useEffect, useCallback} from 'react';
import { Layout, Typography, Button } from 'antd';
import './NewOrg.css';
import QAndAPage from './QAndAPage';

function OrgPage({orgId}) {

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Content className="org-content">
                    <Typography.Title level={2}>Org Page</Typography.Title>
                    <QAndAPage orgId={orgId} />
          </Layout.Content>
      </Layout>
    );
};


export default OrgPage;