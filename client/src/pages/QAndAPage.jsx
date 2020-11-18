import React, {useState, useEffect, useCallback} from 'react';
import { Layout, Typography, Button } from 'antd';
import QAndAOrganizer from '../components/QAndAOrganizer';
import './NewOrg.css';
import { addFAQ,getFAQ } from '../api/authenticationApi';

function QAndAPage({orgId}) {
    const [qA, setQA] = useState([]);
    if(isNaN(orgId)){
        orgId = 2;
    }    
    useEffect(() => {
        getFAQ(orgId)
        .then(res => {
          const faq = res.data;
          console.log("getting org " + orgId);
          console.log("setting data" + faq)
          setQA(faq);
        })

    }, qA)
    const onFinish = useCallback(async (qA) => {
        try {
            const updatedQA = getUpdatedQA(qA);
            await addFAQ(updatedQA);
        } catch (error) {
            throw error;
        }
    }, []);
    function addQAField(){
        setQA([...qA, {id: qA.length, org_id: orgId,  question: "", answer: "", updated: true}]);
    }
    function updateItem(i, question, answer, id){
        const qACopy = [...qA]
        qACopy[i] = {id:id, org_id: orgId, question: question, answer: answer, updated: true}
        setQA(qACopy)
    }
    function getUpdatedQA(qA){
        const updated = qA.filter(item => item.updated);
        return updated;
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