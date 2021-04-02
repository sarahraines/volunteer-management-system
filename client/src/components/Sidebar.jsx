import React, { useCallback, useEffect } from 'react';
import { Menu } from 'antd';
import { BulbOutlined, LogoutOutlined, PlusSquareOutlined, CheckSquareOutlined, SettingOutlined, UsergroupAddOutlined, BarChartOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axiosAPI from '../api/axiosApi';
import { logout } from '../api/authenticationApi';
import './Sidebar.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarItem } from '../actionCreators';

const { Divider, Item, SubMenu } = Menu;

const Sidebar = ({member}) =>  {
    const sidebarItem = useSelector(state => state.sidebar_item).toString();
    const history = useHistory();
    const dispatch = useDispatch();
    const onSelect = (latestSelectedKey) => {
        dispatch(setSidebarItem(latestSelectedKey.key));
    }

    const onLogout = useCallback(async () => {
        await axiosAPI.post("token/blacklist/", {
            refresh_token: localStorage.getItem("refresh_token")
        });
        logout();
        history.push("/login");
    }, [history]);

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
                selectedKeys={[sidebarItem]}
                onSelect={onSelect}
            >
                <SubMenu title="Take action" icon={<BulbOutlined />}>
                    <Item className="action-submenu-item" key="create-org" icon={<UsergroupAddOutlined />}>
                        Create an organization
                    </Item>
                    <Item className="action-submenu-item" key="create-event" icon={<PlusSquareOutlined />}>
                        Create event
                    </Item>
                    <Item className="action-submenu-item" key="browse-orgs" icon={<SearchOutlined />}>
                        Browse organizations
                    </Item>
                    <Item className="action-submenu-item" key="set-goals" icon={<CheckSquareOutlined />}>
                        Set goals
                    </Item>
                    <Item className="action-submenu-item" key="calendar" icon={<CalendarOutlined />}>
                        View my events
                    </Item>
                    <Item className="action-submenu-item" key="view-analytics" icon={<BarChartOutlined />}>
                        View my analytics
                    </Item>
                    <Item className="action-submenu-item" key="give-feedback" icon={<BarChartOutlined />}>
                        Give Feedback
                    </Item>
                </SubMenu>
                <Divider/>
            </Menu>
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[sidebarItem]}
                onSelect={onSelect}
            >
                {organizationsList}
            </Menu>
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[sidebarItem]}
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
