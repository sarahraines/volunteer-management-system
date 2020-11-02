import React, {useState, useCallback} from 'react';
import { Typography } from 'antd';
import QAndA from './QAndA';
import './QAndA.css';


function QAndAOrganizer ({qA, updateItem}) {
    console.log(qA)

    return (
        qA.map((item, i)=> <div className="qa-container"><QAndA id={item.id} valInArr={i} updateItem={updateItem} question={item.question} answer={item.answer}/></div>)

    )


}
export default QAndAOrganizer;