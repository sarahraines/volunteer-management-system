import React from 'react';
import { Typography } from 'antd';
import NewOrgForm from '../forms/NewOrgForm';
import './NewOrg.css';

const NewOrg = () => {
    return (
        <div className='org-container'>
            <Typography.Title level={2}>Create organization</Typography.Title>
            <NewOrgForm />
        </div>
    );
};


export default NewOrg;