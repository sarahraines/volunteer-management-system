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
  const [selectedKeys, setSelectedKeys] = useState([]);
  const onSelect = (latestSelectedKey) => {
    setSelectedKeys([latestSelectedKey.key]);
}
  return (
    <Layout style={{ height:"100vh" }}>
      <Sider width={240} style={{ background: '#fff' }}>
        <Sidebar selectedKeys={ selectedKeys} onSelect={onSelect} setFeedContext={setContextFromSidebar}/>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
          <FeedContent selectedKeys={ selectedKeys} context={context}/>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Feed;