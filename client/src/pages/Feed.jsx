import React from "react";
import { Layout } from 'antd';
import Sidebar from "../components/Sidebar";

const { Content, Sider } = Layout;

function Feed() {
  return (
    <Layout style={{ height:"100vh" }}>
      <Sider width={240} style={{ background: '#fff' }}>
        <Sidebar/>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
          Content
        </Content>
      </Layout>
    </Layout>
  );
}

export default Feed;