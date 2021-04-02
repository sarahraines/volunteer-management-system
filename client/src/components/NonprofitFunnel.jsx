import React from 'react';
import { Typography} from 'antd';
import Plotly from 'react-plotly.js';
import "./NonprofitFunnel.css"

function NonprofitFunnel({funnel, breakdown, volunteers, events}) {

    var labels = [];
    var counts = [];
    var hours = [];

    breakdown.forEach(element => labels.push(element.label));
    breakdown.forEach(element => counts.push(element.count));
    breakdown.forEach(element => hours.push(element.hours));

    labels.splice(-1,1);
    counts.splice(-1,1);
    hours.splice(-1,1);

    var eventCount = []
    var hourCount = []

    volunteers.forEach(element => eventCount.push(element.count));
    volunteers.forEach(element => hourCount.push(element.total));

    var ratings = [0, 0, 0, 0, 0];
    var satisfactions = [0, 0, 0, 0, 0]; 

    events.forEach(element => ratings[Math.floor(element.avg_rating) - 1] += 1); 
    events.forEach(element => satisfactions[Math.floor(element.avg_satisfaction) - 1] += 1); 

    return (
        <React.Fragment>
            <Typography.Title level={5}>Summary</Typography.Title>
            <div className='rowC'>
                <Plotly data={[{
                    type: 'funnel', 
                    y: ["Members", "Event Attendees", "Feedback Providers"], 
                    hoverinfo: 'Members+percent total+x', 
                    opacity: 0.65, 
                    marker: {color: ["003F5C", "58508D", "BC5090"]},
                    x: funnel,
                    }]} layout={{margin: {l: 125, r:20, b:20, t:75}, title: 'Volunteer Engagement', width:600, height: 350}}/>

                <Plotly
                    data={[{
                        type: 'pie', 
                        marker: {colors: ["003F5C", "58508D", "BC5090"]},
                        labels: ['Returning', 'One-Time', 'Inactive'],
                        values: counts,
                        name: 'Count',
                        textinfo: 'percent+value',
                        opacity: 0.65,
                        domain: {
                        row: 0,
                        column: 0
                        }},
                        {type: 'pie', 
                        marker: {colors: ["003F5C", "58508D", "BC5090"]},
                        labels: ['Returning', 'One-Time', 'Inactive'],
                        values: hours,
                        name: 'Hours',
                        textinfo: 'percent+value',
                        opacity: 0.65,
                        domain: {
                        row: 0,
                        column: 1
                        }}
                        ]}
                    layout={{
                        grid: {rows: 1, 
                                columns: 2},
                        showlegend: true,
                        legend: {"orientation": "h"},
                        margin: {l: 125, r:20, b:20, t:75}, width: 600, height: 350,
                        title: 'Volunteer Counts and Hours'}}/>
            </div>
            <div className='rowC'>
                <Plotly data={[{
                    type: 'histogram', 
                    x: eventCount,
                    nbinsx: 5,
                    marker: {
                        color: ["003F5C", "374C80", "7A5195", "DD5182", "FF6E54", "FFA600"],
                        },
                        opacity: 0.65, 
                    }]} 
                    layout={{margin: {l: 125, r:20, b:50, t:75}, 
                    title: 'Events per Volunteer', 
                    width:600, 
                    height: 350,
                    bargap: 0.2,
                    xaxis: {
                        title: {
                          text: 'Events Attended',
                        },
                      },
                    yaxis: {
                        title: {
                          text: 'Number of Volunteers',
                        },
                      },
                      }}/>
                <Plotly data={[{
                    type: 'histogram', 
                    x: hourCount,
                    nbinsx: 5,
                    marker: {
                        color: ["003F5C", "374C80", "7A5195", "DD5182", "FF6E54", "FFA600"],
                        },
                        opacity: 0.65, 
                    }]} 
                    layout={{margin: {l: 125, r:20, b:50, t:75}, 
                    title: 'Hours per Volunteer', 
                    width:600, 
                    height: 350,
                    bargap: 0.2,
                    xaxis: {
                        title: {
                          text: 'Hours Volunteered',
                        },
                      },
                    yaxis: {
                        title: {
                          text: 'Number of Volunteers',
                        },
                      },
                      }}/>
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
                    title: 'Average Event Ratings', 
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
                    title: 'Average Event Satisfaction', 
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

} export default NonprofitFunnel;

