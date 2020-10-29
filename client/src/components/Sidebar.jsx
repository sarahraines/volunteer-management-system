import React, { useState } from 'react';
import { Menu } from 'antd';
import { LogoutOutlined, PlusSquareOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import './Sidebar.css';

const { Divider, Item, SubMenu } = Menu;

const Sidebar = () =>  {

    const [openKeys, setOpenKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const onOpenChange = (newOpenKeys) => {
        const latestOpenKey = newOpenKeys.find(key => !!key && openKeys.indexOf(key) === -1);
        setOpenKeys([latestOpenKey]);
        setSelectedKeys([]);
    }

    const onSelect = (latestSelectedKey) => {
        setSelectedKeys([latestSelectedKey.key]);
    }

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
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                selectedKeys={selectedKeys}
                onSelect={onSelect}
            >
                <SubMenu key="sub1" title="Navigation One">
                    <Menu.Item key="1">Option 1</Menu.Item>
                    <Menu.Item key="2">Option 2</Menu.Item>
                    <Menu.Item key="3">Option 3</Menu.Item>
                    <Menu.Item key="4">Option 4</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title="Navigation One">
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" title="Navigation One">
                    <Menu.Item key="9">Option 9</Menu.Item>
                    <Menu.Item key="10">Option 10</Menu.Item>
                    <Menu.Item key="11">Option 11</Menu.Item>
                    <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
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