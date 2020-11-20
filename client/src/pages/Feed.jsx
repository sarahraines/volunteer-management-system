import React, { useState, useCallback, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Alert, Layout } from 'antd';
import { removeAlert } from '../actionCreators.js';
import Sidebar from "../components/Sidebar";
import FeedContent from "../components/FeedContent";
import axiosAPI from '../api/axiosApi';

const { Content, Sider } = Layout;

const Feed = () => {
  const [context, setContext] = useState([]);
  const [member, setMember] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const setContextFromSidebar = (newContext) => {
    setContext(newContext);
  }
  const alerts = useSelector(state => state.alerts, shallowEqual);
  const dispatch = useDispatch();

  const onClose = useCallback((id) => {
    setTimeout(() => dispatch(removeAlert(id)), 500);
  }, [dispatch]);



  const alertList = alerts.map(alert => 
    <Alert
      key={alert.id}
      type={alert.alert_type}
      message={alert.message}
      banner
      closable
      onClose={() => onClose(alert.id)}
    />
  );

  const getMember = useCallback(async () => {
    try {
         const response = await axiosAPI.get("user/get-member/", {
             params: {
                 user_id: localStorage.getItem("user_id"), 
             }
         });
        const member = response.data;
        if (member.length > 0) {
            setMember(member)
            setSelectedKeys([member[0]?.organizations.id.toString()])
            setContextFromSidebar(member[0]?.organizations.id.toString() ?? "");
        } else {
            setSelectedKeys(["create"])
        }
    } catch(error) {
        console.error(error);
    }
}, [setContextFromSidebar])

useEffect(() => {
  getMember()
}, []);

  return (
    <Layout style={{ height:"100vh" }}>
      <Sider width={240} style={{ background: '#fff' }}>
        <Sidebar selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} member={member} setFeedContext={setContextFromSidebar}/>
      </Sider>
      <Layout>
        {alertList}
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
            <FeedContent member={member} context={context}/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Feed;