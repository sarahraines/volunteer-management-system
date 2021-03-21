import React, {useState, useCallback, useEffect} from 'react';
import { Card, Typography, Button, message } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
const { Title } = Typography;


function BrowseOrgs({}) {
    const [orgs, setOrgs] = useState([]);
    const getPublicOrgs = useCallback(async () => {
        try {
            const response = await axiosAPI.get("organization/get-public-orgs/");
            setOrgs(response.data);
            console.log(orgs)
        } catch (error) {
            console.error(error);
        }
    }, [setOrgs]);
    useEffect(() => {
        getPublicOrgs();
     }, [getPublicOrgs])
    
    const addMember = useCallback(async (name) => {
        try {
            await axiosAPI.post("member/create/", {
                user_id: localStorage.getItem("user_id"),
                organization: name,
                member_type: 1,
                status: 0,
            });
            message.success('Added to Organization');
        } catch {
            message.error('Unable to add to Organization');
        }
    }, []);

    return (
        orgs.length > 0 && (
            orgs.map(org => 
            <Card title={org.name} extra={<Button type="primary" onClick= {() => addMember(org.name)} >Join {org.name}</Button>} style={{ width: 300 }}>
                    <p>{org.description}</p>
                    <p>{org.website}</p>
                    <p>{org.address}</p>
                </Card>
        ))
    );
};

export default BrowseOrgs;