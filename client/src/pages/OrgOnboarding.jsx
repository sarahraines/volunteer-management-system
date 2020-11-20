import React, {useState, useCallback} from 'react';
import { Form, Input, Button, Layout, Typography } from 'antd';
import './NewOrg.css';
// import { addFormValues } from '../api/authenticationApi';

const OrgOnboarding = () => {
    const [inputList, setInputList] = useState([]);
    const [currentInput, setCurrentInput] = useState("");
    function addValueToList(){
        setInputList([...inputList, currentInput.state.value]);
    }
    const onFinish = useCallback(async (inputList) => {
        try {
            // await addFormValues(inputList)
        } catch (error) {
            throw error;
        }
    }, []);
    
    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Content className="org-content">
                <div className='org-container'>
                    <Typography.Title level={2}>Volunteer Onboarding</Typography.Title>
                    <Typography.Text level={3}>We automatically collect the following information about volunteers:  </Typography.Text>
                    <Typography.Text level={1}> first name, last name, email, password, phone number, address, age</Typography.Text>
              </div>
              <Form
                name="org-onboarding"
                className="org-onboarding-form"
                initialValues={{ remember: true }}
                onFinish={() => onFinish(inputList)}
            >
                
               <Input
                    // prefix={<LockOutlined className="site-form-item-icon" />}
                    type="text"
                    placeholder="Form Field"
                    name="new_field"
                    ref={(input) => setCurrentInput(input)}
                />
                 <Button type="primary" onClick={addValueToList} shape="circle"> + </Button>
                <Form.Item>
                <Button type="primary" htmlType="submit" className="org-form-button">
                    Create organization
                </Button>
            </Form.Item>
            </Form>
                 
          </Layout.Content>
      </Layout>
    );
};


export default OrgOnboarding;