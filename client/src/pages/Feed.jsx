import React, { useState, useCallback, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { removeAlert, setOrgs, setSidebarItem } from '../actionCreators.js';
import { NotificationOutlined, QuestionOutlined } from '@ant-design/icons';
import { Alert, Layout, Button, Modal } from 'antd';
import Sidebar from "../components/Sidebar";
import FeedContent from "../components/FeedContent";
import ReportModal from "../components/ReportModal";
import Tutorial from "../components/Tutorial"; 
import axiosAPI from '../api/axiosApi';
import "./Feed.css"

const { Content, Sider } = Layout;

const Feed = () => {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const alerts = useSelector(state => state.alerts, shallowEqual);
  const orgs = useSelector(state => state.orgs);
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
        response.data.forEach(member => member.key = member.organization.id)
        dispatch(setOrgs(response.data));
        dispatch(setSidebarItem(response?.data[0]?.key.toString() ?? 'create-org'));
    } catch(error) {
        console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getMember()
  }, [getMember]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
      setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const closeModal = () => {
    setIsModalShowing(false);
  };

  return (
    <>
      <Layout id="content" style={{ minHeight:"100vh" }}>
        <Sider width={240} style={{ background: '#fff' }}>
          <Sidebar member={orgs}/>
        </Sider>
        <Layout>
          {alertList}
          <Layout style={{ padding: '24px', height: "100%"  }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0, display: "flex", flexDirection: "column" }}>
              <div className="button-container">
                <Button className="tutorial-button" shape="circle" icon={<QuestionOutlined />} onClick={showModal}></Button>
                <Button className="notifications-button" shape="circle" icon={<NotificationOutlined />} onClick={() => setIsModalShowing(true)}></Button>
                <Modal title="Application Tutorial" visible={isModalVisible} footer={null} onOk={handleOk} onCancel={handleCancel}>
                    <Tutorial/>
                </Modal>
                <FeedContent member={orgs} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <ReportModal isModalShowing={isModalShowing} onClose={closeModal}/>
    </>
  );
}

export default Feed;