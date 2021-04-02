import React, {useState, useCallback, useEffect} from 'react';
import { Typography, List, message } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import OrgCard from '../components/OrgCard';
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
            console.log(complete_data)

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
        <React.Fragment>
            <Typography.Title level={2}>Browse organizations</Typography.Title>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                }}
                dataSource={orgs}
                renderItem={item => (
                    <List.Item>
                        <OrgCard key={item.id} org={item} />
                    </List.Item>
                )}
            />
        </React.Fragment>
    );
};

export default BrowseOrgs;