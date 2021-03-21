import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Radio, Form, Input, Button, Select, message } from 'antd';
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import "./NewOrgForm.css";

const { TextArea } = Input;

const NewOrgForm = () => {
    const [selectedCauses, setSelectedCauses] = useState([]);
    const [causes, setCauses] = useState([]);
    const [isPublic, setIsPublic] = React.useState(true);

    const getCauses = useCallback(async () => {
        try {
            const response = await axiosAPI.get("causes/get/");
            setCauses(response.data);
        } catch (error) {
            console.error(error)
        }
    }, [setCauses]);

    useEffect(() => {
        getCauses();
    }, [getCauses]);

    const onChangeRadio = e => {
        console.log('radio checked', e.target.value);
        setIsPublic(e.target.value);
      };

    const filteredCauses = useMemo(() => {
        return causes.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses, causes]);

    const onFinish = useCallback(async (values) => {
        try {
            await axiosAPI.post("organization/create/", {
                name: values.name,
                causes: values.causes,
                description: values.description,
                website: values.website,
                phone: values.phone,
                address: values.address,
                email: values.email,
                public: values.isPublic
            });
            await axiosAPI.post("member/create/", {
                user_id: localStorage.getItem("user_id"),
                organization: values.name,
                member_type: 1,
                status: 0,
            });
            message.success('Organization created');
        }
        catch {
            message.error('Organization creation failed');
        }
    }, []);

    return (
        <Form
            name="org"
            className="org-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >   
            <Form.Item
                name="name"
                hasFeedback
                rules={[{ required: true, message: 'Organization name is required.' }]}
            >
                <Input style={{ width: '100%' }} placeholder="Organization name" maxLength={128} />
            </Form.Item>
            <Form.Item
                name="causes"
                hasFeedback
            >
                <Select
                    mode="multiple"
                    placeholder="Charitable cause(s)"
                    value={selectedCauses}
                    onChange={setSelectedCauses}
                >
                    
                {filteredCauses.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                        {item.name}
                    </Select.Option>
                ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="website"
            >
                <Input style={{ width: '100%' }} placeholder="Website" />
            </Form.Item>
            <Form.Item
                name="phone"
            >
                <Input style={{ width: '100%' }} placeholder="Telephone" />
            </Form.Item>
            <Form.Item
                name="email"
                hasFeedback
                rules={[
                    { type: 'email', message: 'Not a valid email.' }
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="address"
            >
                <TextArea style={{ width: '100%' }} placeholder="Street Address" autoSize />
            </Form.Item>
            <Form.Item
                name="description"
                hasFeedback
                rules={[{ required: true, message: 'Organization description is required.' }]}
            >
                <TextArea row={6} style={{ width: '100%' }} placeholder="Describe your organization..." />
            </Form.Item>
            <Form.Item name="isPublic">
                <Radio.Group onChange={onChangeRadio} value={isPublic}>
                    <Radio value={false}>Invitation Only</Radio>
                    <Radio value={true}>Public</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="org-form-button">
                    Create
                </Button>
            </Form.Item>
        </Form>
    );
};

export default NewOrgForm;