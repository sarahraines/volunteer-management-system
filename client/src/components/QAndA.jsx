import React, {useState, useCallback} from 'react';
import { Typography } from 'antd';
import './QAndA.css';
const { Title, Paragraph } = Typography;


function QAndA ({valInArr, updateItem, question, answer}) {
    const [questionStr, setQuestionStr] = useState(question);
    const [answerStr, setAnswerStr] = useState(answer);
    function updateQ(questionStr){
        setQuestionStr(questionStr)
        updateItem(valInArr, questionStr, answerStr)
    }
    function updateA(answerString){
        setAnswerStr(answerString)
        updateItem(valInArr, questionStr, answerString)
    }



    return (
        <div className='org-container'>
        <Title level={5}>Question</Title>
        <Paragraph  editable={{ onChange: (questionStr) => updateQ(questionStr) }}>{questionStr}</Paragraph>

        <Title level={5}>Answer</Title>
        <Paragraph editable={{ onChange: (answerStr) => updateA(answerStr) }}>{answerStr}</Paragraph>
        </div>


    )


}
export default QAndA;