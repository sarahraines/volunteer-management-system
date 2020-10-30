import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import "antd/dist/antd.css";
import "./NewOrgForm.css";
import axiosAPI from "../api/axiosApi";

const {TextArea} = Input;

const NewOrgForm = () => {
    const onFinish = useCallback(async (values) => {
        await axiosAPI.post("organization/create/", {
            name: values.name,
            causes: values.causes,
            description: values.description,
        });
    }, []);
    
    const [selectedCauses, setSelectedCauses] = useState([]);
    const [causes, setCauses] = useState([]);

    useEffect(() => {
        getCauses();
    }, []);

    const getCauses = async () => {
        try{
            const response = await axiosAPI.get("causes/get/");
            setCauses(response.data);
        } catch (error) {
            console.error(error)
        }
    }
    //console.log(axiosAPI.get("causes/get/"));
    
    //const filteredCauses = causes.data;
    const filteredCauses = useMemo(() => {
        return causes.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses, causes]);

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
                style={{ width: '100%' }}
            >
                
            {filteredCauses.map(item => (
                <Select.Option key={item.id} value={item.id}>
                    {item.name}
                </Select.Option>
            ))}
            </Select>
        </Form.Item>
        
        <Form.Item
            name="description"
            hasFeedback
            rules={[{ required: true, message: 'Organization description is required.' }]}
        >
            <TextArea row={6} style={{ width: '100%' }} placeholder="Describe your organization..." />
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit" className="org-form-button">
                Create organization
            </Button>
        </Form.Item>
    </Form>
  );
};

export default NewOrgForm;