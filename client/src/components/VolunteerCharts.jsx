import React from 'react';
import { Typography} from 'antd';
import Plotly from 'react-plotly.js';

function VolunteerCharts({monthlyHours, nonprofits, events}) {

    var nonprofit_list = []
    var events_list = []
    var hours_list = []

    nonprofits.forEach(element => nonprofit_list.push(element.events__organizations__name)); 
    nonprofits.forEach(element => events_list.push(element.count)); 
    nonprofits.forEach(element => hours_list.push(element.hours)); 

    var ratings = [0, 0, 0, 0, 0];
    var satisfactions = [0, 0, 0, 0, 0]; 

    events.forEach(element => ratings[element.overall - 1] += 1); 
    events.forEach(element => satisfactions[element.satisfaction - 1] += 1); 

    return (
        <React.Fragment>
            <Typography.Title level={5}>Summary</Typography.Title>

            <div className='rowC'>
                <Plotly data={[{
                    type: 'bar', 
                    x: monthlyHours[2],
                    y: monthlyHours[3],
                    nbinsx: 5,
                    marker: {
                        color: "58508D",
                        },
                        opacity: 0.65, 
                    }]} 
                    layout={{margin: {l: 125, r:20, b:50, t:75}, 
                    title: 'Events over Time', 
                    width:600, 
                    height: 350,
                    bargap: 0.2,
                }}/>
                <Plotly data={[{
                    type: 'bar', 
                    x: monthlyHours[0],
                    y: monthlyHours[1],
                    nbinsx: 5,
                    marker: {
                        color: "58508D",
                        },
                        opacity: 0.65, 
                    }]} 
                    layout={{margin: {l: 125, r:20, b:50, t:75}, 
                    title: 'Hours Over Time', 
                    width:600, 
                    height: 350,
                    bargap: 0.2,
                }}/>
            </div> 

             <div className='rowC'>
                <Plotly
                    data={[{
                        type: 'pie', 
                        marker: {colors: ["003F5C", "58508D", "BC5090"]},
                        labels: nonprofit_list,
                        values: events_list,
                        name: 'Events',
                        textinfo: 'percent+value',
                        opacity: 0.65}]}
                    layout={{
                        showlegend: true,
                        margin: {l: 125, r:20, b:20, t:75}, width: 600, height: 350,
                        title: 'Events by Nonprofit'}}/>
                
                <Plotly
                    data={[{
                        type: 'pie', 
                        marker: {colors: ["003F5C", "58508D", "BC5090"]},
                        labels: nonprofit_list,
                        values: hours_list,
                        name: 'Hours',
                        textinfo: 'percent+value',
                        opacity: 0.65}]}
                    layout={{
                        showlegend: true,
                        margin: {l: 125, r:20, b:20, t:75}, width: 600, height: 350,
                        title: 'Hours by Nonprofit'}}/>
            </div>
            

            <div className='rowC'>
                <Plotly data={[{
                    type: 'bar', 
                    x: ratings,
                    y: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'],
                    orientation: 'h',
                    nbinsx: 5,
                    marker: {
                        color: ["003F5C", "58508D", "BC5090", "FF6361", "FFA600"],
                        },
                        opacity: 0.65, 
                    }]} 
                    layout={{margin: {l: 125, r:20, b:50, t:75}, 
                    title: 'Event Ratings', 
                    width:600, 
                    height: 350,
                    bargap: 0.2,
                    xaxis: {
                        title: {
                          text: 'Number of Events',
                        },
                      },
                      }}/>
                <Plotly data={[{
                    type: 'bar', 
                    x: satisfactions,
                    y: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
                    orientation: 'h',
                    nbinsx: 5,
                    marker: {
                        color: ["003F5C", "58508D", "BC5090", "FF6361", "FFA600"],
                        },
                        opacity: 0.65, 
                    }]} 
                    layout={{margin: {l: 125, r:20, b:50, t:75}, 
                    title: 'Event Satisfaction', 
                    width:600, 
                    height: 350,
                    bargap: 0.2,
                    xaxis: {
                        title: {
                          text: 'Number of Events',
                        },
                      },
                      }}/>
            </div>  
        </React.Fragment>
    )

} export default VolunteerCharts;

