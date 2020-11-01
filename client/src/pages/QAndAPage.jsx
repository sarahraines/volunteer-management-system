import React, {useState, useEffect, useCallback} from 'react';
import { Layout, Typography, Button } from 'antd';
import QAndAOrganizer from '../components/QAndAOrganizer';
import './NewOrg.css';
import { addFAQ,getFAQ } from '../api/authenticationApi';

function QAndAPage() {
    const [qA, setQA] = useState([]);
    // useCallback(async () => {
    //     try {
    //         // console.log(qA)
    //         response = await getFAQ();
    //         setQA
    //         // if (isRegister) {
    //         //     await register(values.email, values.first_name, values.last_name, values.password)
    //         // } else {
    //         //     await login(values.email, values.password);
    //         //     history.push("/");
    //         // }
    //     } catch (error) {
    //         throw error;
    //     }
    // }, []);
    useEffect(() => {

        getFAQ()
        .then(res => {
          const faq = res.data;
          setQA(faq);
        })

    })
    const onFinish = useCallback(async (qA) => {
        try {
            // console.log(qA)
            await addFAQ(qA);
            // if (isRegister) {
            //     await register(values.email, values.first_name, values.last_name, values.password)
            // } else {
            //     await login(values.email, values.password);
            //     history.push("/");
            // }
        } catch (error) {
            throw error;
        }
    }, []);
    function addQAField(){
        setQA([...qA, {question: "", answer: ""}]);
    }
    function updateItem(i, question, answer){
        const qACopy = [...qA]
        qACopy[i] = {question: question, answer: answer}
        setQA(qACopy)
    }
    

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Content className="org-content">
                    <Typography.Title level={2}>Question And Answer Page</Typography.Title>
                    <QAndAOrganizer qA={qA} updateItem={updateItem}/>
                    <Button type="primary" onClick={addQAField} shape="circle"> + </Button>
                    <Button htmlType="submit" onClick={() => onFinish(qA)}> Submit </Button>
          </Layout.Content>
      </Layout>
    );
};


export default QAndAPage;