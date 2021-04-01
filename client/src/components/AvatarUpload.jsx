import React, { useEffect, useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import './AvatarUpload.css';

const AvatarUpload = ({updateImageField, initialImageURL}) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (initialImageURL) {
      setFileList([{
        name: '',
        status: 'done',
        url: initialImageURL,
      }]);
      updateImageField(-1);
    }
  }, []);

  const onChange = async({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      const file = newFileList[0];
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        file.thumbUrl = reader.result;
        setFileList(newFileList);
      }
    } else {
      setFileList(newFileList);
    }
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    image.height = 500;
    const imgWindow = window.open(src);
    if (imgWindow) {
        imgWindow.document.write(image.outerHTML);
    }
  };

  return (
    <ImgCrop rotate quality={1.0}>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        onRemove={_file => {
          updateImageField(null);
        }}
        customRequest={async (options) => {
          options.onSuccess(null, options.file);
          updateImageField(options.file);
        }}
      >
        {fileList.length < 1 && '+ Upload'}
      </Upload>
    </ImgCrop>
  );
};

export default AvatarUpload; 
