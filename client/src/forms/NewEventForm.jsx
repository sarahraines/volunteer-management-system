import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, DatePicker, Space} from 'antd';
import "antd/dist/antd.css";
import "./NewEventForm.css"
import axiosAPI from "../api/axiosApi";

const {TextArea} = Input;
const { RangePicker } = DatePicker;

const NewEventForm = () => {
    const onFinish = useCallback(async (values) => {
        console.log(values);
        const response = await axiosAPI.post("event/create/", {
            name: values.name,
            virtual: values.virtual,
            location: values.location,
            causes: values.causes,
            date:values.date,
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

    const filteredCauses = useMemo(() => {
        return causes.filter(o => !selectedCauses.includes(o));
    }, [selectedCauses, causes]);

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
            <Input style={{ width: '100%' }} placeholder="Event name"/>
        </Form.Item>
        <Form.Item
            name="virtual"
            hasFeedback
            rules={[{ required: true, message: 'Virtual/non-virtual specification is rquired.' }]}
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
            name="date"
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
                    <Select.Option key={item.id} value={item.id}>
                        {item.name}
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
}; export default NewEventForm; 