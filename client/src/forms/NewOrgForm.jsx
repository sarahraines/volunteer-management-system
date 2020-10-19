import React, { useCallback, useMemo, useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import "antd/dist/antd.css";
import "./NewOrgForm.css"

const {TextArea} = Input;
const OPTIONS = ['Women\'s Rights', 'Environment', 'Education'];

const NewOrgForm = () => {
    const [selectedCauses, setSelectedCauses] = useState([]);
    const filteredCauses = useMemo(() => {
        return OPTIONS.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses]);
    const onFinish = useCallback((values) => {
        console.log(values);
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
            <Input style={{ width: '100%' }} placeholder="Organization name" />
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
                    <Select.Option key={item} value={item}>
                        {item}
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