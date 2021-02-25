import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, message, Typography, Table } from 'antd';
import axiosAPI from '../api/axiosApi';
import UserFilesTable from '../pages/UserFilesTable';
import { UploadOutlined } from '@ant-design/icons';
const { Title } = Typography;

function ClearanceUpload({isAdmin, orgId, eId}) {
    const [fileList, setFileList] = useState([]);

    const getOrgFiles = useCallback(async (orgId) => {
        try {
            const response = await axiosAPI.get("clearances/get-org-files-for-event/", {
                params: {
                    orgId: orgId, 
                    eventId: eId
                }
            });
            const files = response.data;
            
            const formattedFiles = files.map(file => ({
                key: file.id, 
                uid: file.id, 
                name: file.empty_form.split('/').slice(-1).pop(), 
                status: "done", 
                url: file.empty_form,
                event: file.event,
                eventName: file.event__name
            }));
            setFileList(formattedFiles);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        getOrgFiles(orgId)
    }, [orgId]);

    const orgProps = {
        listType: 'picture',
        fileList: fileList,
        onChange(info) {
            let fl = [...info.fileList];
            fl = fl.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.empty_form;
                }
                return file;
            });
                
            setFileList(fl);
        },
        customRequest: async function(options) {
            const formData = new FormData();
            formData.append('empty_form', options.file, options.file.name);
            formData.append('orgId', orgId);
            formData.append('eventId', eId);
            try {
                let data = await axiosAPI.post('clearances/upload-org-file', formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    }
                });
                options.onSuccess(data, options.file);
                message.success('File uploaded');
            } catch (error) {
                message.success('File failed to upload');
                console.log(error)
            }
        },
    };

    return (
        <div>
            {isAdmin ? 
                <>
                    <Upload {...orgProps}>
                        <Button icon={<UploadOutlined/>}>Upload New Form</Button>  
                    </Upload>
                </> :
                <UserFilesTable orgId={orgId} fileList={fileList} />
            }
           
        </div>
    );
};
export default ClearanceUpload;

    