import React from 'react';
import { Typography} from 'antd';
import Plotly from 'react-plotly.js';

function NonprofitFunnel({ data}) {

    return (
        <React.Fragment>
            <Typography.Title level={5}>Goals</Typography.Title>
                <Plotly data={[{
                    type: 'funnel', 
                    y: ["Number of Members", "Members who Attended Events", "Members who Provided Feedback"], 
                    x: data}]} layout={{margin: {l: 250}, width:800, height: 500}}/>
        </React.Fragment>
    )

} export default NonprofitFunnel;

