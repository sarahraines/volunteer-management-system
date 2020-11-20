import React, {useState, useEffect, useCallback} from 'react';
import {Form, Typography, Calendar, Card, Skeleton} from 'antd';
import "antd/dist/antd.css";

const { Paragraph, Title } = Typography;

const AboutUs = ({org}) => {
    console.log(org)
    return (
        <Skeleton loading={!org} active>
            <Card style={{ maxWidth: 300, height: "100%" }} headStyle={{ margin: 0 }}>
                <Title level={5}>Causes</Title>
                {/* {org.causes.map(c => 
                    <Typography.Paragraph key={c.id} level={2}>{c.name}</Typography.Paragraph>
                )} */}
                <br/>
                <Title level={5}>Description</Title>
                <Paragraph editable>{org?.description}</Paragraph>
                <Title level={5}>Admins</Title>
            </Card>
        </Skeleton>
    );
}; export default AboutUs;
