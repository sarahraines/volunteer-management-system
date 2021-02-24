import React from 'react';
import Plot from 'react-plotly.js';

function EventLeaderboard({data}) {
    return (
        <React.Fragment>      
            <Plot
                data={[
                {type: 'pie', labels: data.ratings_arr[0], values: data.ratings_arr[1]},
                ]}
                layout={ {width: 360, height: 270, title: 'Rating'} }
            />

            <Plot
                data={[
                {type: 'pie', labels: data.satisfactions_arr[0], values: data.satisfactions_arr[1]},
                ]}
                layout={ {width: 360, height: 270, title: 'Satisfaction'} }
            />
            <Plot
                data={[
                {type: 'pie', labels: data.likely_arr[0], values: data.likely_arr[1]},
                ]}
                layout={ {width: 360, height: 270, title: 'Recommend Likelihood'} }
            />
            <Plot
                data={[
                {type: 'pie', labels: data.expectations_arr[0], values: data.expectations_arr[1]},
                ]}
                layout={ {width: 360, height: 270, title: 'Met Expectations'} }
            />
            <Plot
                data={[
                {type: 'pie', labels: data.future_arr[0], values: data.future_arr[1]},
                ]}
                layout={ {width: 360, height: 270, title: 'Future Volunteer'} }
            />
        </React.Fragment>
    )


} export default EventLeaderboard;

