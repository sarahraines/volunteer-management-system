import React, {useState, useEffect} from 'react';
import { Button, Typography } from 'antd';
import QAndA from '../components/QAndA';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';

const { Title } = Typography;

function QAndAPage({isAdmin, orgId}) {
    const [qA, setQA] = useState([]);

    const getQA = async (orgId) => {
        try {
            const response =  await axiosAPI.get("organization/get-faq/", {
                params: {
                    org_id: orgId,
                }
            });
            setQA(response.data);
        } catch(error) {
            console.error(error);
        }
    }

    const removeFaq = (id) => {
        setQA(qA.filter(faq => faq.id !== id));
    }

    useEffect(() => {
        if (orgId) {
            getQA(orgId);
        }
    }, [orgId]);

    const addQAField = async () => {
        const response = await axiosAPI.post("faq/upsert/", {
            org_id: orgId, question: "", answer: ""
        });
        setQA([...qA, {id: response.data.id, question: "", answer: ""}]);
    }

    return (
        <div>
            <Title level={4}>Frequently asked questions</Title>
            {qA.map(item => 
                <QAndA isAdmin={isAdmin===1} key={item.id} item={item} removeFaq={removeFaq}/>
            )}
            <Button style={{ width: '100%' }} type="primary" onClick={() => {addQAField()}}>Add New FAQ</Button>
        </div>
    );
};


export default QAndAPage;