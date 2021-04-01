import React, { useCallback, useState, useEffect } from 'react';
import { Typography, Skeleton, Tag, Descriptions, PageHeader, Button, Modal, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import NewOrgForm from '../forms/NewOrgForm';

const { Paragraph } = Typography;

const AboutUs = ({org, isAdmin}) => {
    const [causes, setCauses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const getCausesByOrg = useCallback(async () => {
        if (org?.id) {
            try {
                const response = await axiosAPI.get("organization/get-causes/", {
                    params: {
                        orgId: org?.id
                    }
                });
                setCauses(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    }, [setCauses, org?.id]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
    }, [org?.id]);

    const closeModalWithUpdate = useCallback(() => {
        setIsModalVisible(false);
        getCausesByOrg();
    }, [org?.id, getCausesByOrg]);

    const setLoading = useCallback((loadingVal) => {
        setIsLoading(loadingVal);
    }, []);

    useEffect(() => {
        getCausesByOrg();
    }, [org?.id, getCausesByOrg]);

    const tags = (
        <React.Fragment>
            {causes.map(cause => 
                <Tag 
                    key={cause.id} 
                    color="blue" 
                >
                    {cause.name}
                </Tag>
            )}
        </React.Fragment>
    );

    return (
        <Skeleton loading={!org} active>
            <PageHeader
                title={`About ${org?.name}`}
                className="site-page-header"
                tags={tags}
                extra={isAdmin && [
                    <Button key="1" type="primary" icon={<EditOutlined />} onClick={setIsModalVisible}>
                      Edit organization
                    </Button>,
                  ]}
            >
                  <Descriptions>
                    {org?.website && <Descriptions.Item label="Website"><a target="_blank" href={org.website}>{org.website}</a></Descriptions.Item>}
                    {org?.phone && <Descriptions.Item label="Telephone">{org.phone}</Descriptions.Item>}
                    {org?.email && <Descriptions.Item label="Email"><a href={`mailto:${org.email}`}>{org.email}</a></Descriptions.Item>}
                    {org?.address && <Descriptions.Item label="Street Address">{org.address}</Descriptions.Item>}
                </Descriptions>
                <Paragraph>{org?.description}</Paragraph>
            </PageHeader>
            <Modal 
                title="Edit organization" 
                visible={isModalVisible}
                onCancel={closeModal}
                footer={[
                    <Button key="cancel" onClick={closeModal}>
                      Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isLoading} onClick={form.submit} >
                      Update
                    </Button>,
                  ]}
            >
                <NewOrgForm form={form} org={org} closeModalWithUpdate={closeModalWithUpdate} setLoading={setLoading}/>
            </Modal>
        </Skeleton>
    );
}; 

export default AboutUs;
