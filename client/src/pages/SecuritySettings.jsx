import React, {useState, useEffect} from 'react';
import { Divider, Typography } from 'antd';
import ResetPasswordForm from '../forms/ResetPasswordForm';
import axiosAPI from "../api/axiosApi";

function SecuritySettings() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser();
     }, [])

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");
        const url = `users/get/?user_id=${userId}`;
        const response = await axiosAPI.get(url);
        setUser(response.data.user);
    }

    return (
        <React.Fragment>
            <div style={{ maxWidth: '600px' }}>
                <Typography.Title level={4}>Reset password</Typography.Title>
                <ResetPasswordForm />
            </div>
            <Divider/>
        </React.Fragment>
    );
}

export default SecuritySettings;