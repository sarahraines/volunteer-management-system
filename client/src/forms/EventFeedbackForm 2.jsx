import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Form, Input, Button, Radio} from 'antd';
import axiosAPI from "../api/axiosApi";
import { useDispatch } from 'react-redux';
import { addAlert } from '../actionCreators.js';
import "antd/dist/antd.css";
import "./EventFeedbackForm.css"

const {TextArea} = Input;

const EventFeedbackForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const onFinish = useCallback(async (values) => {
        setIsLoading(true);
        try {
            await axiosAPI.post("eventFeedback/create/", {
                id: new URLSearchParams(window.location.search).get('attendee_id'),
                overall: values.overall,
                satisfaction: values.satisfaction,
                likely: values.likely,
                expectations: values.expectations,
                future: values.future,
                better:values.better,
                experience:values.experience,
            });
            dispatch(addAlert('Feedback submitted', 'success'));
        }
        catch {
            dispatch(addAlert('Feedback submission failed', 'error'));
        }
        setIsLoading(false);
    }, []);

    const [info, setInfo] = useState([]);

    useEffect(() => {
        getInfo();
    }, []);

    const getInfo = async () => {
        try{
            const response = await axiosAPI.get("event/get-event-by-id/", {
                 params: {
                     attendee_id: new URLSearchParams(window.location.search).get('attendee_id'),  
                 }
             });
            setInfo(response.data[0]); 
        } catch (error) {
            console.error(error)
        }
    } 

    const options = [
        { label: 'Poor', value: 'Poor' },
        { label: 'Fair', value: 'Fair' },
        { label: 'Average', value: 'Average'},
        { label: 'Good', value: 'Good'},
        { label: 'Excellent', value: 'Excellent'},
    ];

    const s_options = [
        { label: 'Very Dissatisfied', value: 'Very Dissatisfied' },
        { label: 'Dissatisfied', value: 'Dissatisfied' },
        { label: 'Neutral', value: 'Neutral'},
        { label: 'Satisfied', value: 'Satisfied'},
        { label: 'Very Satisfied', value: 'Very Satisfied'},
    ];
    const l_options = [
        { label: 'Very Unlikely', value: 'Very Unlikely'},
        { label: 'Somewhat Unlikely', value: 'Somewhat Unlikely'},
        { label: 'Neutral', value: 'Neutral'},
        { label: 'Somewhat Likely', value: 'Somewhat Likely' },
        { label: 'Very Likely', value: 'Very Likely' },
    ];
    const yn_options = [
        { label: 'Yes', value: 'Yes'},
        { label: 'No', value: 'No'},
    ];

  return (

     <Form
        name="event-feedback"
        className="event-feedback-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
    >

        <p>
            <strong>Name: </strong>{info.username__first_name} {info.username__last_name}<br/>
            <strong>Email: </strong>{info.username__email}<br/>
            <strong>Organization: </strong> {info.events__organizations__name}<br/>
            <strong>Event: </strong>{info.events__name} <br/>
            <strong>Location: </strong>{info.events__location}<br/>
            <strong>Date: </strong>{info.events__begindate}-{info.events__enddate}<br/>
        </p>
        

        <p>How would you rate your overall experience?</p>
        <Form.Item
            name="overall"
            hasFeedback
            rules={[{ required: true, message: 'Overall experience rating required.' }]}
        >
        <Radio.Group
              options={options}
              optionType="button"
              buttonStyle="solid"
        />
        </Form.Item>
        <p>How satisfied did you feel after volunteering?</p>
        <Form.Item
            name="satisfaction"
            hasFeedback
            rules={[{ required: true, message: 'Satisfiaction rating required.' }]}
        >
        <Radio.Group
              options={s_options}
              optionType="button"
              buttonStyle="solid"
        />
        </Form.Item>
        <p>How likely are you to recommend future volunteer opportunities to your friends?</p>
        <Form.Item
            name="likely"
            hasFeedback
            rules={[{ required: true, message: 'Recommend rating required.' }]}
        >
        <Radio.Group
              options={l_options}
              optionType="button"
              buttonStyle="solid"
        />
        </Form.Item>
        <p>Did the experience meet your expectations?</p>
        <Form.Item
            name="expectations"
            hasFeedback
            rules = {[{ required: true, message: 'Expectations rating required.' }]}>
        <Radio.Group options={yn_options}/>
        </Form.Item>
        <p>Do you plan to volunteer with us again in the future?</p>
        <Form.Item
            name="future"
            hasFeedback
            rules = {[{ required: true, message: 'Future rating required.' }]}>
        <Radio.Group options={yn_options}/>
        </Form.Item>
        <p>What could we have done better?</p>
        <Form.Item
            name="better"
            hasFeedback
        >
            <TextArea row={6} style={{ width: '100%' }} placeholder="Response here" />
        </Form.Item>
        <p>Is there anything else you’d like for us to know about your volunteer experience?</p>
        <Form.Item
            name="experience"
            hasFeedback
        >
            <TextArea row={6} style={{ width: '100%' }} placeholder="Response here" />
        </Form.Item>
         <Form.Item>
            <Button type="primary" htmlType="submit" className="event-feedback-form-button" loading={isLoading}>
                Submit feedback
            </Button>
        </Form.Item>
    </Form>
  );
};


export default EventFeedbackForm;