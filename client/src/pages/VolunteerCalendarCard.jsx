import React, {useCallback, useEffect, useState} from 'react';
import { Calendar, Typography , Button, Popover} from 'antd';
import axiosAPI from "../api/axiosApi";

const { Paragraph } = Typography;

function VolunteerCalendarCard ({item}){
    const [vis, setVisible] = useState([false]); 

    const toggleVisible = () => {
        // console.log("visible" + visible);
        setVisible(!vis);
    };

	return (
		<Popover 
            content={
                <div>
                    <Typography.Title level={4}>{item.events__name}</Typography.Title>
                    <a onClick={toggleVisible}>
                        Close
                    </a>
                </div>}
            trigger="click"
            visible={!vis}
            // onVisibleChange={handleVisibleChange(visible)}
        >
            <Button type="link" className="event-viewmore-form-button" onClick={toggleVisible}>
                > {item.events__name}
            </Button>
        </Popover>
	);
	


} export default VolunteerCalendarCard; 

