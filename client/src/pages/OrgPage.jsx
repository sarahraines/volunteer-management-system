import React from 'react';
import { Typography } from 'antd';
import OrganizationLogo from '../svg/create_org.svg';
import './NewOrg.css';

const OrgPage = () => {
    return (
        <div className='org-container'>
            <Typography.Title level={2}>Org Page</Typography.Title>
            <img 
                className="org-logo"
                src={OrganizationLogo} 
                alt={"organization logo"}
            />
        </div>
    );
};


export default OrgPage;