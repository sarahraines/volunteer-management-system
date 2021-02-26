import React, { useCallback, useState, useEffect } from 'react';
import { Typography, Skeleton, Tag, Descriptions, PageHeader, Input } from 'antd';
import axiosAPI from "../api/axiosApi";
import "antd/dist/antd.css";
import { PlusOutlined } from '@ant-design/icons';
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
            >
                  <Descriptions>
                    {org?.website && <Descriptions.Item label="Website"><a href={org.website}>{org.website}</a></Descriptions.Item>}
                    {org?.phone && <Descriptions.Item label="Telephone">{org.phone}</Descriptions.Item>}
                    {org?.email && <Descriptions.Item label="Email"><a href={`mailto:${org.email}`}>{org.email}</a></Descriptions.Item>}
                    {org?.address && <Descriptions.Item label="Street Address">{org.address}</Descriptions.Item>}
                </Descriptions>
                <Paragraph editable>{org?.description}</Paragraph>
            </PageHeader>
        </Skeleton>
    );
}; 

export default AboutUs;
