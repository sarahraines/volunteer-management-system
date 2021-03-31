import React, {useState, useCallback, useEffect} from 'react';
import { Upload, Button, Table, message, Typography } from 'antd';
import {StatusTag} from '../components/StatusTag';
import axiosAPI from '../api/axiosApi';
import './NewOrg.css';
import { UploadOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
const { Text } = Typography;

function UserFilesTable({orgId, fileList}) {
    const [userFileList, setUserFileList] = useState([]);
    const getUserFiles = useCallback(async (orgId) => {
        try {
             const response = await axiosAPI.get("clearances/get-user-files/", {
                 params: {
                     userId: localStorage.getItem("user_id"), 
                     orgId: orgId
                 }
             });
            const files = response.data;
            const formattedFiles = files.map(file => ({
                uid: file.id, 
                orgFormId: file.org_file,
                status: file.status,
                url: file.url,
                comment: file.comment
            }));
            setUserFileList(formattedFiles);
        } catch(error) {
            console.error(error);
        }
    }, [orgId]);

    useEffect(() => {
        getUserFiles(orgId)
    }, [orgId]);

    const props = {
        listType: 'text',
        fileList: [],
        onChange(info) {
            let fl = [...info.fileList];
            fl = fl.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.filled_form;
                }
                return file;
            });
                
            setUserFileList(fl);
        },
    };
    
    const columns = [
        {
            title: 'Incomplete File',
            dataIndex: 'incomplete_file',
            key: 'incomplete_file',
            render: url => !!url ? <a target="_blank" href={url}>{url.split('/').slice(-1)[0].split('?')[0]}</a> : null,
        },
        {
            title: 'Your Uploaded File',
            dataIndex: 'uploaded_file',
            key: 'uploaded_file',
            render: url => !!url ? <a target="_blank" href={url}>{url.split('/').slice(-1)[0].split('?')[0]}</a> : null,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_text, record) => <StatusTag status={record.status} />
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: (text, _record) => <p>{text}</p> 
        },
        {
            title: 'Upload New File',
            key: 'upload',
            render: (record) => (
                // <Dragger {...orgProps}>
                //         {/* <Button icon={<UploadOutlined/>}>Upload New Form</Button>   */}
                //         <p className="ant-upload-drag-icon">
                //         <InboxOutlined />
                //         </p>
                //         <p className="ant-upload-text">Click or drag file to this area to upload</p>
                //     </Dragger>
                <Dragger {...props} 
                    customRequest={async (options) => {
                            const formData = new FormData();
                            formData.append('org_file_id', record.key);
                            formData.append('user_id', localStorage.getItem("user_id"))
                            formData.append('filled_form', options.file, options.file.name);
                            formData.append('status', 'Pending');
                            formData.append('comment', 'N/A');
                            try {
                                let data = await axiosAPI.post('clearances/upload-user-file', formData, {
                                    headers: {
                                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                                    }
                                });
                                options.onSuccess(data, options.file);
                                getUserFiles(orgId);
                                message.success('File uploaded');
                            } catch (error) {
                                message.success('File failed to upload');
                                console.log(error)
                            }
                        }
                    }
                >
                    <UploadOutlined/>
                    <p></p>
                    <Text>Click or drag file to this area to upload</Text>
                </Dragger>
            ),
        },
    ];

    function getUserFileForOrgFile(infoType, oFormId) {
        if ((userFileList.filter(ufile => ufile.orgFormId == oFormId)).length > 0) {
            const userFile = userFileList.filter(ufile => ufile.orgFormId == oFormId)[0]
            return userFile[infoType]
        }

        if (infoType == "status") {
            return "None";
        }

        return null
    }
    
    const data = fileList.map((file,i) => ({
        "key": file.uid, 
        "incomplete_file": file.url,
        "uploaded_file": getUserFileForOrgFile("url", file.uid),
        "status": getUserFileForOrgFile("status", file.uid),
        "comment": getUserFileForOrgFile("comment", file.uid),
    }))
    
    console.log(data)

    return (
        <div>
           <Table columns={columns} dataSource={data}/>
        </div>
    );
};
export default UserFilesTable;