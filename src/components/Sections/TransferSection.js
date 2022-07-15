import { TransferDisplay } from "../Data/TransferDisplay"
import React, { useState } from "react"
import { ArrayField } from "../Fields/ArrayField";
import { Field } from "../Fields/Field";
import { inputDataHook, sectionStateHook, treeHook } from "../../util/Atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import {TreeDisplay} from "../Data/TreeDisplay"
import { Button, Dropdown, Menu, Space, Typography } from 'antd';
import { pathToJSON } from "../../util/toJSON";
// import { DownOutlined } from '@ant-design/icons';
// import { TableDisplay } from "../Data/TableDisplay";
// import { leafNodeToJSON, pathToArray, treeToJSON } from "../../util/TreeToJSON";
// import { treeNodeToColumn } from "../../util/TreeNodeToColumn";

const isMatch = (pathArray, currentPath) => {

    let foundIndex = -1
    // TODO can optimize this to not loop thru every time
    let index = 0
    for(let pathItem of pathArray) {
        if(currentPath.match(pathItem)) foundIndex = index
        else break;
        index++

    }
    if(foundIndex == -1) return "none"
    if(foundIndex == pathArray.length - 1) return "complete"
    else return "partial"

}

const findTreeItem = (treeLeft, pathArray) => {
    let minMatchingTreeItem ={}
    // iterate through whats left of the tree
    for(let treeItem of treeLeft) {
        let isMatchReturn = isMatch(pathArray, treeItem.key)
        if(isMatchReturn == 'partial'){
            minMatchingTreeItem = treeItem
        } 
        else if(isMatchReturn == 'complete') return treeItem
    }


    return findTreeItem(minMatchingTreeItem.children, pathArray)


}

export const TransferSection = ({title, schema, transfer}) => {
    const [showData, setShowData] =  useState(true)
    const inputData = useRecoilValue(inputDataHook)
    //gets the first array item of the schema item for this section
    const data = transfer.map(transferItem => {
        // I dont think I need this
        // could be good if we need to remove the direct path or render children
        // let foundTreeItem = findTreeItem(tree, pathArray)
        return pathToJSON(transferItem.path, inputData)
    })



    const createSectionFields = () => {
        return Object.keys(schema).map((fieldName) => {
          const field = schema[fieldName];

          if (Array.isArray(field))
            return <ArrayField sectionTitle={title} title={fieldName} templateItem={field[0]} />;
            else console.error("Only Arrays are supported for Transfer Section right")

        });
    };

    const renderData = () => {
        const newTitle = Object.keys(schema)
        const fieldName = Object.keys(schema[Object.keys(schema)[0]][0])[0]
        if(showData) return(
                <TransferDisplay style={{height: "100%"}} sectionTitle={title} title={newTitle}  fieldName={fieldName} data={data.flat(3).map((item, index) => {return{[fieldName]: item, key: index }})} />
        ) 
        else return(
            <>
                <TreeDisplay />
                <div style={{width: "100%"}}>
                    <h1 style={{textAlign: "center"}}>{title}</h1>
                    {createSectionFields()}
                </div>
            </>
        )

    }

    return(
        <div>
            {showData ? <h1 style={{textAlign :"center"}}>{title}</h1> : null}
          <Button onClick={() => setShowData(!showData)} > 
            {showData ? "Tree View" : "Table View" }
          </Button>
          <div style={{display: "flex", flexDirection: "row"}}>
            {renderData()}

          </div>

        </div>
    )
}