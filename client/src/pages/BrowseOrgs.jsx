import React, {useState, useCallback, useEffect} from 'react';
import { Card, Typography, Button, message } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
const { Title } = Typography;


function BrowseOrgs({}) {
    const [orgs, setOrgs] = useState([]);
    const getPublicOrgs = useCallback(async () => {
        try {
            console.log("user id " + localStorage.getItem("user_id"))
            const response = await axiosAPI.get("organization/get-public-orgs/", {
                params: {
                    user_id: localStorage.getItem("user_id")
                }
            });
            const member_data = response.data["member"]
            const orgsUserIsIn = member_data.map(item => item.organization.id)
            const orgsUserIsInSet = new Set(orgsUserIsIn)
            const orgsToTypeSet = Object.assign({}, ...member_data.map(item => ({[item.organization.id]: item.member_type})))
            const org_data  = response.data["org"]
            const complete_data = org_data.map(org => ({org: org, isCurrMember:orgsUserIsInSet.has(org.id), isAdmin: (orgsUserIsInSet.has(org.id) && orgsToTypeSet[org.id]==1) }))
            setOrgs(complete_data);

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
            orgs.map(data => 
            <Card title={data.org.name} extra={<Button type="primary"  disabled={data.isCurrMember} onClick= {() => addMember(data.org.name)} >Join {data.org.name}</Button>} style={{ width: 300 }}>
                    <p>{data.org.description}</p>
                    <p>{data.org.website}</p>
                    <p>{data.org.address}</p>
                </Card>
        ))
    );
};

export default BrowseOrgs;