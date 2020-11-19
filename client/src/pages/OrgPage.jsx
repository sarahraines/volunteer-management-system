import React, {useState, useEffect, useCallback} from 'react';
import { Layout, Typography, Button } from 'antd';
import './NewOrg.css';
import QAndAPage from './QAndAPage';
import axiosAPI from '../api/axiosApi';
import { Menu } from 'antd';
const { Divider, Item } = Menu;

function OrgPage({orgId}) {
    
    const [org, setOrg] = useState(null);
    useEffect(() => {
        getOrgInfo();
    }, [orgId]);

    var orgInfo;
    const getOrgInfo = async () => {
        try{
            console.log("attempting request" + orgId)
            const response = await axiosAPI.get("organization/get-info/", {
                params: {
                    orgId: orgId
                }
            });
            console.log(response.data)
            setOrg(response.data)
        } catch(error) {
            console.error(error);
        }
    }


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
        </Layout.Content>
    </Layout>
    );
    
};


export default OrgPage;