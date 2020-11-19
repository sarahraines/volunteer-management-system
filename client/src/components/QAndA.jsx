import React, {useState} from 'react';
import { Typography, Card, Switch, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axiosAPI from '../api/axiosApi';
import './QAndA.css';
const { Paragraph } = Typography;


function QAndA ({item, removeFaq}) {
    const [questionStr, setQuestionStr] = useState(item?.question);
    const [answerStr, setAnswerStr] = useState(item?.answer);
    const updateQ = async (questionStr) => {
        setQuestionStr(questionStr)
        try {
            await axiosAPI.post("faq/upsert/", {
                id: item?.id, question: questionStr, answer: answerStr
            });
            message.success('Question updated');
        }
        catch {
            message.error('Question failed to update');
        }
    }
    const updateA = async (answerString) => {
        setAnswerStr(answerString)
        try {
            await axiosAPI.post("faq/upsert/", {
                id: item?.id, question: questionStr, answer: answerStr
            });
            message.success('Answer updated');
        }
        catch {
            message.error('Answer failed to update');
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
                <Paragraph style={{ display: "inline-block" }} editable={{ onChange: (questionStr) => updateQ(questionStr) }}>{questionStr}</Paragraph>
            </div>
            <div>
                <Paragraph style={{ display: "inline-block", verticalAlign: "top", fontWeight: 700 }}>Answer: </Paragraph>
                {'  '}
                <Paragraph style={{ display: "inline-block" }} editable={{ onChange: (answerStr) => updateA(answerStr) }}>{answerStr}</Paragraph>
            </div>
            <Switch checkedChildren="Public" unCheckedChildren="Hidden" />
        </Card>
    )

}
export default QAndA;