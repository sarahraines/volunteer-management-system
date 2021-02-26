import React from 'react';
import { Typography } from 'antd';
import NewOrgForm from '../forms/NewOrgForm';
import { usePageView } from '../utils/googleAnalytics'
import './NewOrg.css';

const NewOrg = () => {
    usePageView('/create-organization')
    return (
        <div className='org-container'>
            <Typography.Title level={2}>Create organization</Typography.Title>
            <NewOrgForm />
        </div>
    );
};


export default NewOrg;