import React from "react";

import { Table } from 'antd';

export const TableDisplay = ({style, columns, dataSource, height}) => {

    return (
        <Table
        style={style}
        scroll={{ y: height }}
        columns={columns}
        dataSource={dataSource}
        />
    )
}