import React from "react";
import Tag from "antd/lib/tag";
import "antd/lib/tag/style/css";

const statusMap = {
  Complete: <Tag color="green">Complete</Tag>,
  Pending: <Tag color="orange">Pending Approval</Tag>,
  Incomplete: <Tag color="red">Incomplete</Tag>
};

export const StatusTag = ({ status }) => statusMap[status];