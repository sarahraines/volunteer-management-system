import React from 'react';
import { Layout, Typography } from 'antd';
import OrganizationLogo from '../svg/create_org.svg';
import NewOrgForm from '../forms/NewOrgForm';
import './NewOrg.css';

const NewOrg = () => {
    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Content className="org-content">
                <div className='org-container'>
                    <Typography.Title level={2}>Create organization</Typography.Title>
                    <img 
                        className="org-logo"
                        src={OrganizationLogo} 
                        alt={"organization logo"}
                    />
                    <NewOrgForm />
              </div>
          </Layout.Content>
      </Layout>
    );
};


export default NewOrg;