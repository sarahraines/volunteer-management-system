import React, { useState, useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Alert, Layout } from 'antd';
import { removeAlert } from '../actionCreators.js';
import Sidebar from "../components/Sidebar";
import FeedContent from "../components/FeedContent";

const { Content, Sider } = Layout;

const Feed = () => {
  const [context, setContext] = useState([]);
  const setContextFromSidebar = (newContext) => {
    setContext(newContext);
    console.log(newContext);
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

  return (
    <Layout style={{ height:"100vh" }}>
      <Sider width={240} style={{ background: '#fff' }}>
        <Sidebar setFeedContext={setContextFromSidebar}/>
      </Sider>
      <Layout>
        {alertList}
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
            <FeedContent context={context}/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Feed;