import React, {useState, useEffect} from 'react';
import { Upload, Button, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

function Clearances({isAdmin, orgId}) {
    //front end demo https://codesandbox.io/s/s98mf
    const props = {
    action: '',
    listType: 'picture',
    previewFile(file) {
      console.log('Your upload file:', file);
      // Your process logic. Here we just mock to the same file
        axiosAPI.post('upload_file', file, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };

    return (
        <div>
            <Title level={4}>Clearances</Title>
            <Upload {...props}>
                <Button icon={<UploadOutlined/>}>Upload</Button>  
            </Upload>
           
        </div>
    );
};


export default Clearances;