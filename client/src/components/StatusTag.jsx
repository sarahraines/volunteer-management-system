import React from "react";
import Tag from "antd/lib/tag";
import "antd/lib/tag/style/css";

const statusMap = {
  Complete: <Tag color="green">Complete</Tag>,
  Rejected: <Tag color="red">Rejected</Tag>,
  Pending: <Tag color="orange">Pending Approval</Tag>,
  None: <p></p>
};

export const StatusTag = ({ status }) => statusMap[status];