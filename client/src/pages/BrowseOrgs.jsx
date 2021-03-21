import React, {useState, useCallback, useEffect} from 'react';
import { Card, Typography } from 'antd';
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
    
   

    return (
        orgs.length > 0 && (
            orgs.map(org => 
            <Card title={org.name} extra={<a href="#">Join {org.name}</a>} style={{ width: 300 }}>
                    <p>{org.description}</p>
                    <p>{org.website}</p>
                    <p>{org.address}</p>
                </Card>
        ))
    );
};

export default BrowseOrgs;