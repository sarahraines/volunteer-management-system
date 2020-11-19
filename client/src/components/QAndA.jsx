import React, {useState} from 'react';
import { Typography, Card, Switch, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axiosAPI from '../api/axiosApi';
import './QAndA.css';
const { Paragraph } = Typography;


function QAndA ({item, removeFaq}) {
    const [questionStr, setQuestionStr] = useState(item?.question || "");
    const [answerStr, setAnswerStr] = useState(item?.answer || "");
    const [isPublic, setIsPublic] = useState(!!item?.is_public);

    const updateQ = async (newQuestionStr) => {
        setQuestionStr(newQuestionStr)
        try {
            await axiosAPI.post("faq/upsert/", {
                id: item?.id, question: newQuestionStr, answer: answerStr
            });
            message.success('Question updated');
        }
        catch {
            message.error('Question failed to update');
        }
    }
    const updateA = async (newAnswerStr) => {
        setAnswerStr(newAnswerStr)
        try {
            await axiosAPI.post("faq/upsert/", {
                id: item?.id, question: questionStr, answer: newAnswerStr, is_public: isPublic
            });
            message.success('Answer updated');
        }
        catch {
            message.error('Answer failed to update');
        }
    }
    const updatePublic = async (newIsPublic) => {
        setIsPublic(newIsPublic)
        try {
            await axiosAPI.post("faq/upsert/", {
                id: item?.id, question: questionStr, answer: answerStr, is_public: newIsPublic
            });
            message.success('FAQ updated');
        }
        catch {
            message.error('FAQ failed to update');
        }
    }
    const onDelete = async () => {
        try {
            await axiosAPI.delete("faq/delete/", {
                params: {
                    id: item?.id,
                }
            });
            removeFaq(item?.id)
            message.success('FAQ deleted');
        }
        catch {
            message.error('FAQ failed to delete');
        }
    }

    return (
        <Card style={{ marginTop: 8, marginBottom: 8 }} loading={!item} actions={[<DeleteOutlined onClick={onDelete} key="delete" />]}>
            <div>
                <Paragraph style={{ display: "inline-block", verticalAlign: "top", fontWeight: 700 }}>Question: </Paragraph>
                {'  '}
                <Paragraph style={{ display: "inline-block" }} editable={{ onChange: (newQuestionStr) => updateQ(newQuestionStr) }}>{questionStr}</Paragraph>
            </div>
            <div>
                <Paragraph style={{ display: "inline-block", verticalAlign: "top", fontWeight: 700 }}>Answer: </Paragraph>
                {'  '}
                <Paragraph style={{ display: "inline-block" }} editable={{ onChange: (newAnswerStr) => updateA(newAnswerStr) }}>{answerStr}</Paragraph>
            </div>
            <Switch checkedChildren="Public" unCheckedChildren="Hidden" onChange={(newIsPublic) => updatePublic(newIsPublic)} defaultChecked={item?.is_public}/>
        </Card>
    )

}
export default QAndA;