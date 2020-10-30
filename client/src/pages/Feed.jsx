import React, { useState } from "react";
import { Layout } from 'antd';
import Sidebar from "../components/Sidebar";
import FeedContent from "../components/FeedContent";

const { Content, Sider } = Layout;

const Feed = () => {
  const [context, setContext] = useState([]);
  const setContextFromSidebar = (newContext) => {
    setContext(newContext);
  }
  return (
    <Layout style={{ height:"100vh" }}>
      <Sider width={240} style={{ background: '#fff' }}>
        <Sidebar setFeedContext={setContextFromSidebar}/>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
          <FeedContent context={context}/>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Feed;