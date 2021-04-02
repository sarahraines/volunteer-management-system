import React from 'react';
import { Divider, Typography } from 'antd';
import ResetPasswordForm from '../forms/ResetPasswordForm';

function SecuritySettings() {
    return (
        <React.Fragment>
            <div style={{ maxWidth: '600px' }}>
                <Typography.Title level={4}>Reset password</Typography.Title>
                <ResetPasswordForm isAuthenticated={true}/>
            </div>
            <Divider/>
        </React.Fragment>
    );
}

export default SecuritySettings;