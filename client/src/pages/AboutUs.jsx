import React, { useCallback, useState, useEffect } from 'react';
import { Typography, Skeleton, Tag, Descriptions, Button, PageHeader, Input } from 'antd';
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import { FacebookOutlined, InstagramOutlined, PlusOutlined, TwitterOutlined } from '@ant-design/icons';
import { useRef } from 'react';

const { Paragraph, Title } = Typography;

const AboutUs = ({org}) => {
    const [causes, setCauses] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();

    const getCausesByOrg = useCallback(async () => {
        if (org?.id) {
            try {
                const response = await axiosAPI.get("organization/get-causes/", {
                    params: {
                        orgId: org?.id
                    }
                });
                setCauses(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    }, [setCauses, org]);

    useEffect(() => {
        getCausesByOrg();
    }, [org, getCausesByOrg]);

    const handleClose = useCallback(async (removedTag) => {
        const tags = causes.filter(cause => cause.id !== removedTag);
        setCauses(tags);
    }, [causes, setCauses]);
    
    const handleInputConfirm = useCallback(() => {
        const newCauses = 
            (inputValue && causes.map(cause => cause.name).indexOf(inputValue) === -1)
                ? [...causes, {name: inputValue, id: newCauses.length}]
                : causes;
        setCauses(newCauses);
        setInputVisible(false);
        setInputValue("");
    }, [setCauses, setInputValue, setInputVisible, causes]);

    const showInput = () => {
        setInputVisible(true);
    }

    const tags = (
        <React.Fragment>
            {causes.map(c => 
                <Tag 
                    key={c.id} 
                    color="blue" 
                    closable 
                    onClose={e => {
                        e.preventDefault();
                        handleClose(c.id);
                    }}
                >
                    {c.name}
                </Tag>
            )}
            {inputVisible && (
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={(e) => {setInputValue(e.target.value)}}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag onClick={showInput} className="site-tag-plus">
                    <PlusOutlined /> New Tag
                </Tag>
            )}
        </React.Fragment>
    );

    return (
        <Skeleton loading={!org} active>
            <PageHeader
                title={`About ${org?.name}`}
                className="site-page-header"
                tags={tags}
                extra={[
                    <Button key="instagram" type="primary" icon={<InstagramOutlined />} />,
                    <Button key="facebook" type="primary" icon={<FacebookOutlined />} />,
                    <Button key="twitter" type="primary" icon={<TwitterOutlined />} />
                ]}
            >
                  <Descriptions>
                    <Descriptions.Item label="Website"><a href="https://www.aclu.org/">https://www.aclu.org/</a></Descriptions.Item>
                    <Descriptions.Item label="Telephone">212-549-2500</Descriptions.Item>
                    <Descriptions.Item label="Contact"><a href="mailto:contact@aclu.org">contact@aclu.org</a></Descriptions.Item>
                    <Descriptions.Item label="Address">
                        125 Broad Street, 18th Floor New York NY 10004
                    </Descriptions.Item>
                </Descriptions>
                <Paragraph editable>{org?.description}</Paragraph>
            </PageHeader>
        </Skeleton>
    );
}; 

export default AboutUs;
