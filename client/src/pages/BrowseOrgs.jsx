import React, {useState, useCallback, useEffect, useMemo} from 'react';
import { Typography, List, Space, Input, Select } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import OrgCard from '../components/OrgCard';

const { Option } = Select;


function BrowseOrgs() {
    const [orgs, setOrgs] = useState([]);
    const [selectedCauses, setSelectedCauses] = useState([]);
    const [filterDisplay, setFilterDisplay] = useState([]);
    const [causes, setCauses] = useState([]);

    const getPublicOrgs = useCallback(async () => {
        try {
            const response = await axiosAPI.get("organization/get-public-orgs/", {
                params: {
                    user_id: localStorage.getItem("user_id")
                }
            });
            setOrgs(response.data);
            setFilterDisplay(response.data)
        } catch (error) {
            console.error(error);
        }
    }, [setOrgs, setFilterDisplay]);

    const getCauses = useCallback(async () => {
        try {
            const response = await axiosAPI.get("causes/get/");
            setCauses(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setCauses]);

    useEffect(() => {
        getCauses();
    }, [getCauses]);

    const handleChange = e => {
        if (e !== "") {
            const newList = orgs.filter(org =>
                org.name.toLowerCase().includes(e.toLowerCase())
            );
            setFilterDisplay(newList);
        } else {
            setFilterDisplay(orgs);
        }
    };

    const filteredCauses = useMemo(() => {
        return causes.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses, causes]);

    useEffect(() => {
        getPublicOrgs();
     }, [getPublicOrgs])
    
    return (
        <React.Fragment>
            <Typography.Title level={2}>Browse organizations</Typography.Title>
            <Space>
                Search by name: <Input onChange={e => handleChange(e.target.value)} placeholder="Event name" size="medium" className="search" style={{height: 33.825}}/>
                Filter by cause:<Select mode="multiple" placeholder="Cause(s)" style={{ minWidth: 200 }} size="medium" value={selectedCauses} onChange={setSelectedCauses}>
                    {filteredCauses.map(item => (
                        <Option key={item.id} value={item.id}>
                            {item.name}
                        </Option>
                    ))}
                </Select>
            </Space> 
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
                dataSource={filterDisplay}
                renderItem={item => (
                    <List.Item>
                        <OrgCard key={item.id} organization={item} selectedCauses={selectedCauses}/>
                    </List.Item>
                )}
            />
        </React.Fragment>
    );
};

export default BrowseOrgs;