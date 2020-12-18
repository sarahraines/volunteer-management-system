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
        return axiosAPI.post('clearances/upload-user-file', {
            file,
            orgId 
        },  {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        // .then(res => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };

  const orgProps = {
    name: 'file',
    previewFile: async function(file) {
      const formData = new FormData();
      formData.append('empty_form', file, "file.txt");
      formData.append('orgId', orgId);
      // Your process logic. Here we just mock to the same file
        try {
            return await axiosAPI.post('clearances/upload-org-file', formData,{
                headers: {
                // 'Content-Type': 'multipart/form-data'
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
                }
            }
            )
            // .then(res => res.json())
            .then(({ thumbnail }) => thumbnail);

        } catch {
            console.log("upload failed")
        }
        
    },
  };

    return (
        <div>
            <Title level={4}>Clearances</Title>
            {isAdmin ? 
                <>
                    <Title level={2}>Add Form</Title>
                    <Upload {...orgProps}>
                        <Button icon={<UploadOutlined/>}>Upload New Form</Button>  
                    </Upload>
                </> :
                
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Upload</Button>  
                </Upload>
            }
           
        </div>
    );
};

// customRequest: async function (file) {
//     const formData = new FormData();
//     formData.append('empty_form', new Blob([file], {type: "image/png"}), file.originFileObj?.name);
//     formData.append('orgId', orgId);
//     // Your process logic. Here we just mock to the same file
//       try {
//            await axiosAPI.post('clearances/upload-org-file', formData,{
//               headers: {
//               // 'Content-Type': 'multipart/form-data'
//               'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  
//               }
//           }
//           )
//           // .then(({ thumbnail }) => thumbnail);

//       } catch(err) {
//           console.log(err)
//       }
export default Clearances;