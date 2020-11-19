import React, {useState, useEffect} from 'react';
import ProfileForm from '../forms/ProfileForm';
import { Divider, Typography, Skeleton } from 'antd';
import axiosAPI from "../api/axiosApi";

function ProfileSettings() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser();
     }, [])

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");
        const url = `users/get/?user_id=${userId}`;
        const response = await axiosAPI.get(url);
        setUser(response.data);
    }

    return (
        <React.Fragment>
            <div style={{ maxWidth: '600px' }}>
                <Typography.Title level={4}>Update Profile</Typography.Title>
                <Skeleton active loading={!user} paragraph={{ rows: 3, width: 'auto' }} title={false}>
                    <ProfileForm user={user}/>
                </Skeleton>
            </div>
            <Divider/>
        </React.Fragment>
    );
}

export default ProfileSettings;