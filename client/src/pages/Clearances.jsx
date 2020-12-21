import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography } from 'antd';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import UserFilesTable from './UserFilesTable';
import { FileDoneOutlined, UploadOutlined } from '@ant-design/icons';
const { Title } = Typography;

function Clearances({isAdmin, orgId}) {
    const [fileList, setFileList] = useState([]);
    const localHost = "http://localhost:8080/"
    const getOrgFiles = useCallback(async (orgId) => {
        try {
             const response = await axiosAPI.get("clearances/get-org-files/", {
                 params: {
                     orgId: orgId, 
                 }
             });
            const files = response.data;
            const formattedFiles = files.map(file => ({uid: file.id, name: file.empty_form.split('/').slice(-1).pop(), status: "done", url: file.empty_form}));
            console.log("Formatted Files", formattedFiles)
            setFileList(formattedFiles);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        getOrgFiles(orgId)
    }, [orgId]);
    function messageHandler(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
    }
  const orgProps = {
    listType: 'picture',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    fileList: fileList,
    onChange(info) {
       messageHandler(info)
        let fl = [...info.fileList];
        fl = fl.map(file => {
            if (file.response) {
              // Component will show file.url as link
              console.log(file)
              file.url = localHost+ file.name;
            }
            return file;
        });
            setFileList(fl);
            console.log("file list here", fileList)
    },
    previewFile: async function(file) {
      const formData = new FormData();
      formData.append('empty_form', file, file.name);
      formData.append('orgId', orgId);
        try {
            return await axiosAPI.post('clearances/upload-org-file', formData,{
                headers: {
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                }
            }
            )
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
                
                <UserFilesTable orgId={orgId} fileList={fileList} messageHandler={messageHandler}/>
            }
           
        </div>
    );
};
export default Clearances;