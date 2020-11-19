import React, { useCallback, useState, useEffect } from 'react';
import { Menu } from 'antd';
import { LogoutOutlined, PlusSquareOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axiosAPI from '../api/axiosApi';
import { logout } from '../api/authenticationApi';
import './Sidebar.css';

const { Divider, Item } = Menu;

const Sidebar = ({setFeedContext}) =>  {
    const history = useHistory();
    const [selectedKeys, setSelectedKeys] = useState([]);

    const onSelect = (latestSelectedKey) => {
        setSelectedKeys([latestSelectedKey.key]);
        console.log(latestSelectedKey);
    }

    const onLogout = useCallback(async () => {
        await axiosAPI.post("token/blacklist/", {
            refresh_token: localStorage.getItem("refresh_token")
        });
        logout();
        history.push("/login");
    }, [history]);

    useEffect(() => {
        setFeedContext(selectedKeys[0] ?? "");
    }, [selectedKeys, setFeedContext]);

    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        getOrganizations();
    }, []);

    const getOrganizations = async () => {
        try{
             const response = await axiosAPI.get("user/get-orgs/", {
                 params: {
                     user_id: localStorage.getItem("user_id"), 
                 }
             });
            setOrganizations(response.data);
        } catch(error) {
            console.error(error);
        }
    }

    const organizationsList = (
		organizations.map(org => 
			<Item key={org.id}>
                {org.name}
            </Item>
		)
    );

    return (
        <div className="menu-container">
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={selectedKeys}
                onSelect={onSelect}
            >
                <Item key="create-org" icon={<PlusSquareOutlined />}>
                    Create new organization
                </Item>
                <Item key="create-event" icon={<PlusSquareOutlined />}>
                    Create new event
                </Item>
                <Item key="find" icon={<SearchOutlined />}>
                    Find service opportunities
                </Item>
                <Divider/>
            </Menu>
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={selectedKeys}
                onSelect={onSelect}
            >
                {organizationsList}
            </Menu>
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={selectedKeys}
                onSelect={onSelect}
            >
                <Divider/>
                <Item key="settings" icon={<SettingOutlined />}>
                    Manage user settings
                </Item>
                <Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
                    Logout
                </Item>
            </Menu>
        </div>
    );
}

export default Sidebar;
