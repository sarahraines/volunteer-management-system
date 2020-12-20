import React, { useCallback, useEffect } from 'react';
import { Menu } from 'antd';
import { BulbOutlined, LogoutOutlined, PlusSquareOutlined, SearchOutlined, SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axiosAPI from '../api/axiosApi';
import { logout } from '../api/authenticationApi';
import './Sidebar.css';

const { Divider, Item, SubMenu } = Menu;

const Sidebar = ({selectedKeys, setSelectedKeys, setFeedContext, member}) =>  {
    const history = useHistory();
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


    const organizationsList = (
		member.map(member => 
			<Item key={member?.organization?.id}>
                {member?.organization?.name}
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
                <SubMenu title="Take action" icon={<BulbOutlined />}>
                    <Item className="action-submenu-item" key="create-event" icon={<PlusSquareOutlined />}>
                        Create event
                    </Item>
                    <Item className="action-submenu-item" key="create-org" icon={<UsergroupAddOutlined />}>
                        Create organization
                    </Item>
                    <Item className="action-submenu-item" key="find" icon={<SearchOutlined />}>
                        Find service opportunities
                    </Item>
                </SubMenu>
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
