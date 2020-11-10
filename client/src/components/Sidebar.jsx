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

    return (
        <div className="menu-container">
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={selectedKeys}
                onSelect={onSelect}
            >
                <Item key="create" icon={<PlusSquareOutlined />}>
                    Create new organization
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
                <Item key="example1">
                    Hack4Impact
                </Item>
                <Item key="example2">
                    American Heart Association
                </Item>
            </Menu>
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={selectedKeys}
                onSelect={onSelect}
            >
                <Divider/>
                <Item key="manage" icon={<SettingOutlined />}>
                    Manage account settings
                </Item>
                <Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}> 
                    Logout
                </Item>
            </Menu>
        </div>
    );
}

export default Sidebar;