import React, {useState, useCallback, useEffect} from 'react';
import { Typography, List, message } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import OrgCard from '../components/OrgCard';


function Notifications() {
    const [orgs, setOrgs] = useState([]);
    console.log(orgs)
    const getPublicOrgs = useCallback(async () => {
        try {
            const response = await axiosAPI.get("organization/get-public-orgs/", {
                params: {
                    user_id: localStorage.getItem("user_id")
                }
            });
            setOrgs(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [setOrgs]);

    useEffect(() => {
        getPublicOrgs();
     }, [getPublicOrgs])
    
    return (
        <React.Fragment>
            <Typography.Title level={2}>Notifications</Typography.Title>
        </React.Fragment>
    );
};

export default Notifications;