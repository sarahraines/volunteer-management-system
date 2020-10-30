import React, { useState } from 'react';
import { Menu } from 'antd';
import { LogoutOutlined, PlusSquareOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import './Sidebar.css';
import { useEffect } from 'react';

const { Divider, Item } = Menu;

const Sidebar = ({setFeedContext}) =>  {

    const [selectedKeys, setSelectedKeys] = useState([]);

    const onSelect = (latestSelectedKey) => {
        setSelectedKeys([latestSelectedKey.key]);
    }

    useEffect(() => {
        setFeedContext(selectedKeys[0] ?? "");
    }, [selectedKeys]);

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
                <Item key="logout" icon={<LogoutOutlined />}>
                    Logout
                </Item>
            </Menu>
        </div>
    );
}

export default Sidebar;