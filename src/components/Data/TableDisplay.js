import React from "react";

import { Table } from 'antd';

export const TableDisplay = ({style, columns, dataSource, height}) => {
    console.log(dataSource)
    console.log(columns)

    return (
        <>
            {Array.isArray(dataSource) &&
                Array.isArray(dataSource[0]) ? (
                    <Table
                    style={style}
                    scroll={{ y: height }}
                    columns={columns}
                    dataSource={dataSource.flat()}
                    />
                ) : (
                    <Table
                    style={style}
                    scroll={{ y: height }}
                    columns={columns}
                    dataSource={dataSource}
                    />
                )}
        </>
    )
}