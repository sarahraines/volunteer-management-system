import React, {useEffect, useState} from 'react';
import UserNotificationsForm from '../forms/UserNotificationsForm';
import { Divider, Typography, Skeleton } from 'antd';
import axiosAPI from "../api/axiosApi";

function UserNotifications() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser();
     }, [])

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");
        const url = `user/get-notification-settings/?user_id=${userId}`;
        const response = await axiosAPI.get(url);
        setUser(response.data);
    }


    return (
        <React.Fragment>
            <div style={{ maxWidth: '600px' }}>
                <Typography.Title level={4}>Update Notifications</Typography.Title>
                <Skeleton active loading={false} paragraph={{ rows: 3, width: 'auto' }} title={false}>
                    <UserNotificationsForm user={user}/>
                </Skeleton>
            </div>
            <Divider/>
        </React.Fragment>
    );
}

export default UserNotifications;