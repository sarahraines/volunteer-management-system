import React, { useCallback, useMemo, useState } from 'react';
import { Form, Input, Button, Select, Switch, DatePicker} from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "./NewEventForm.css"

const {TextArea} = Input;
const OPTIONS = ['Women\'s Rights', 'Environment', 'Education'];

const { RangePicker } = DatePicker;

const NewEventForm = () => {
    const [selectedCauses, setSelectedCauses] = useState([]);
    const filteredCauses = useMemo(() => {
        return OPTIONS.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses]);
    const onFinish = useCallback((values) => {
        console.log(values);
    }, []);

  return (
    <Form
        name="event"
        className="event-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
    >   
        <Form.Item
            name="name"
            hasFeedback
            rules={[{ required: true, message: 'Event name is required.' }]}
        >
            <Input style={{ width: '100%' }} placeholder="Event name" />
        </Form.Item>
        <Form.Item
            name="virtual"
            hasFeedback
            rules={[{ required: true, message: 'Event type is required.' }]}
        >
             <Switch checkedChildren="Virtual" unCheckedChildren="Non-Virtual" defaultChecked />
        </Form.Item>
        <Form.Item
            name="location"
            hasFeedback
        >
             <Input style={{ width: '100%' }} placeholder="Location" />
        </Form.Item>
        <Form.Item
            name="location"
            hasFeedback
        >
              <RangePicker showTime />
        </Form.Item>
         <Form.Item
            name="causes"
            hasFeedback
        >
            <Select
                mode="multiple"
                placeholder="Social Impact cause(s)"
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
        >
            <TextArea row={6} style={{ width: '100%' }} placeholder="Event description" />
        </Form.Item>
         <Form.Item>
            <Button type="primary" htmlType="submit" className="event-form-button">
                Create event
            </Button>
        </Form.Item>
    </Form>
  );
};

export default NewEventForm; 