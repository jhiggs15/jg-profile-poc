
import { Tree, Typography } from "antd"
import React from "react"
import { isObject } from "../../../util/toColumn"
import { getRootValue, pathToArray } from "../../../util/toJSON"

export const createTreeItem = (node, inputData) => {
    let data = getRootValue(pathToArray(node.key), inputData)
    let preview =""
    if(Array.isArray(data)) {
        if(Array.isArray(data[0])) {
            while(Array.isArray(data[0]))data = data.flat()
            preview = data

        }

        if(isObject(data[0])) {
            preview = `${data.length} items`
        }
        else {
            preview = data.reduce((previousValue, currentValue) => `${previousValue}, ${currentValue}`)
        }
    }
    else preview = data

    return <TreeItem title={node.title} preview={preview}/>

}


export const TreeItem = ({title, preview}) => {
    return (
        <div style={{display: "flex", flexDirection: "row", width: "30vh"}}>
            <Typography.Text>{title}</Typography.Text>
            <Typography.Text style={{paddingLeft: 5, paddingRight: 5}}>:</Typography.Text>

            <Typography.Text  ellipsis italic>{preview}</Typography.Text>

        </div>
    )

}