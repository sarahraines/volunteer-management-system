import React, { useEffect } from "react";
import Menu from "antd/lib/menu";
import "antd/lib/menu/style/css";
import Dropdown from "antd/lib/dropdown";
import "antd/lib/dropdown/style/css";
import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";

export const StatusFilter = ({ orgId, filterBy, ...props }) => {
    const onClick = ({ key }) => {
        filterBy(key);
    };

    const menu = (
        <Menu onClick={onClick} defaultSelectedKeys={["4"]}>
        <Menu.Item key="1">Status: Incomplete</Menu.Item>
        <Menu.Item key="2">Status: Pending Approval</Menu.Item>
        <Menu.Item key="3">Status: Complete</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">Show all</Menu.Item>
        </Menu>
    );

    useEffect((orgId) => {
        filterBy("4")
    }, [orgId]);

    return (
        <div {...props}>
        <Dropdown className="filter" overlay={menu}>
            <a className="ant-dropdown-link" href="#">
            Filter By <Icon type="down" />
            </a>
        </Dropdown>
        </div>
    );
};
