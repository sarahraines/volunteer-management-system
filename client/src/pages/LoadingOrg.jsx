import React from 'react';
import { Skeleton } from 'antd';

const LoadingOrg = () => {
    return (
        <Skeleton active paragraph={{ rows: Math.round((window.innerHeight - 136) / 32) - 1 }}/>
    );
};


export default LoadingOrg;