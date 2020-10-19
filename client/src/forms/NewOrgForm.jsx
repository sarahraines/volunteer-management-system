import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Select, Upload, message, Space } from 'antd';
import { LoadingOutlined, PlusOutlined, MailOutlined } from '@ant-design/icons';
import { register, login } from '../api/authenticationApi';
import "antd/dist/antd.css";
import "./NewOrgForm.css"

const NewOrgForm = ({isRegister}) => {
    const history = useHistory();

    const onFinish = useCallback(async (values) => {
        try {
            if (isRegister) {
                await register(values.email, values.first_name, values.last_name, values.password)
            } else {
                await login(values.email, values.password);
                history.push("/");
            }
        } catch (error) {
            throw error;
        }
    }, [isRegister, history]);

    const submitButtonText = "Create organization";

    const {TextArea} = Input;

    const OPTIONS = ['Women\'s Rights', 'Environment', 'Education'];

    class SelectWithHiddenSelectedOptions extends React.Component {
        state = {
            selectedItems: [],
        };

        handleChange = selectedItems => {
            this.setState({ selectedItems });
        };

        render() {
            const { selectedItems } = this.state;
            const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));
            return (
            <Select
                mode="multiple"
                placeholder="Select social impact causes this event addresses"
                value={selectedItems}
                onChange={this.handleChange}
                style={{ width: '100%' }}
            >
                {filteredOptions.map(item => (
                <Select.Option key={item} value={item}>
                    {item}
                </Select.Option>
                ))}
            </Select>
            );
        }
    }

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
      
    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }
      
    class Avatar extends React.Component {
        state = {
          loading: false,
        };
      
        handleChange = info => {
            if (info.file.status === 'uploading') {
                this.setState({ loading: true });
                return;
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
                );
            }
        };
      
        render() {
            const { loading, imageUrl } = this.state;
            const uploadButton = (
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            );
            return (
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            );
        }
    }

  return (
    <React.Fragment>
        <Form
            name="event"
            className="org-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >   
            <Form.Item
                name="event_name"
                hasFeedback
                rules={[{ required: true, message: 'Event name is required' }]}
            >
                <Input style={{ width: '100%' }} placeholder="Event name" />
            </Form.Item>
            <Form.Item
                name="cause"
                hasFeedback
            >
                <SelectWithHiddenSelectedOptions rules={[{ required: true, message: 'Social impact cause is required' }]} />
            </Form.Item>
            <Form.Item
                name="org_desc"
                hasFeedback
                rules={[{ required: true, message: 'Organization description is required' }]}
            >
                <TextArea row={6} style={{ width: '100%' }} placeholder="Organization description" />
            </Form.Item>
            <Form.Item
                name="profile-pic"
                hasFeedback
                rules={[{ required: true, message: 'Profile picture upload' }]}
            >
                Upload a profile picture for  your  organization:
                <Avatar placeholder="Upload profile picture" className="org-form-prof-pic" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="org-form-button">
                    {submitButtonText}
                </Button>
            </Form.Item>
        </Form>
    </React.Fragment>
  );
};

export default NewOrgForm;