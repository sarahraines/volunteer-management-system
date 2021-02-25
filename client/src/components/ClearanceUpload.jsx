import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table } from 'antd';
import axiosAPI from '../api/axiosApi';
import UserFilesTable from '../pages/UserFilesTable';
import { UploadOutlined } from '@ant-design/icons';
const { Title } = Typography;

function ClearanceUpload({isAdmin, orgId, eventId}) {
    const [fileList, setFileList] = useState([]);
    const localHost = "http://localhost:8080/"

    const getOrgFiles = useCallback(async (orgId) => {
        try {
            const response = await axiosAPI.get("clearances/get-org-files/", {
                params: {
                    orgId: orgId, 
                    eventId: eventId
                }
            });
            const files = response.data;
            
            const formattedFiles = files.map(file => ({
                uid: file.id, 
                name: file.empty_form.split('/').slice(-1).pop(), 
                status: "done", 
                url: file.empty_form,
                event: file.event,
                eventName: file.event__name
            }));
            console.log("files: " + formattedFiles);
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
                    file.url = localHost+ file.name;
                }
                return file;
            });
                
            setFileList(fl);
        },
        previewFile: async function(file) {
            const formData = new FormData();
            formData.append('empty_form', file, file.name);
            formData.append('orgId', orgId);
            try {
                return await axiosAPI.post('clearances/upload-org-file', formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    }
                })
                .then(({ thumbnail }) => thumbnail);
            } catch {
                console.log("upload failed")
            }
        },
    };

    const columns = [
        {
            title: 'Event',
            dataIndex: 'event',
            key: 'event',
        }
    ];

    return (
        <div>
            <Title level={4}>Manage Clearances for Each Event</Title>
            {isAdmin ? 
                <>
                    <Upload {...orgProps}>
                        <Button icon={<UploadOutlined/>}>Upload New Form</Button>  
                    </Upload>
                </> :
                
                <UserFilesTable orgId={orgId} fileList={fileList} messageHandler={messageHandler}/>
            }
           
        </div>
    );
};
export default ClearanceUpload;