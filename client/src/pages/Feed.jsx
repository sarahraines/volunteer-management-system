import React, { useState, useCallback, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Alert, Layout, Button, Modal } from 'antd';
import { removeAlert } from '../actionCreators.js';
import Sidebar from "../components/Sidebar";
import FeedContent from "../components/FeedContent";
import Tutorial from "../components/Tutorial"; 
import axiosAPI from '../api/axiosApi';
import "./Feed.css"

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
            setSelectedKeys([member[0]?.organization?.id.toString()])
        } else {
            setSelectedKeys(["create"])
        }
    } catch(error) {
        console.error(error);
    }
  }, [setSelectedKeys, setMember])

  useEffect(() => {
    getMember()
  }, [getMember]);

  const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    function onChange(a, b, c) {
        console.log(a, b, c);
    }

    const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

    const contentStyle = {
        height: '160px',
        color: '#fff',
        background: '#364d79',
        padding: '20px'
      };

  return (
    <Layout style={{ minHeight:"100vh" }}>
      <Sider width={240} style={{ background: '#fff' }}>
        <Sidebar selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} member={member} setFeedContext={setContextFromSidebar}/>
      </Sider>
      <Layout>
        {alertList}
        <Layout style={{ padding: '24px', height: "100%"  }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, display: "flex", flexDirection: "column" }}>
            <div className="button-container">
              <Button className="expand-button" type="primary" onClick={showModal}>
                  Application Tutorial
              </Button>
              <Modal title="Application Tutorial" visible={isModalVisible} footer={null} onOk={handleOk} onCancel={handleCancel}>
                  <Tutorial/>
              </Modal>
              <FeedContent member={member} context={context}/>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Feed;