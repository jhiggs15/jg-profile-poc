import React, { useState } from "react";
import { ArrayField } from "../Fields/ArrayField";
import { Field } from "../Fields/Field";
import { inputDataHook, sectionStateHook, treeHook } from "../../util/Atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import {TreeDisplay} from "../Data/TreeDisplay"
import { Button, Dropdown, Menu, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { TableDisplay } from "../Data/TableDisplay";
import { leafNodeToJSON, pathToArray, treeToJSON } from "../../util/TreeToJSON";
import { treeNodeToColumn } from "../../util/TreeNodeToColumn";


export const ShowDataSection = ({title, schema, pathsToDisplay}) => {
    const inputData = useRecoilValue(inputDataHook)
    const tree = useRecoilValue(treeHook)
    const [section, setSection] = useRecoilState(sectionStateHook)
    // when true shows data, when false shows tree
    const [showData, setShowData] =  useState(true)
    const[curIndex, setCurIndex] = useState(0)
    
    const columns = pathsToDisplay.map(path => treeNodeToColumn(tree.find(treeItem => treeItem.key == path)) )
    const data = pathsToDisplay.map(path => {
        const foundTreeItem = tree.find(treeItem => treeItem.key == path)
        return treeToJSON(foundTreeItem, inputData, foundTreeItem.title)
    })

  
    const createSectionFields = () => {
        return Object.keys(schema).map((fieldName) => {
          const field = schema[fieldName];
          if (Array.isArray(field))
            return <ArrayField sectionTitle={title} title={fieldName} templateItem={field[0]} />;
          else {
            return <Field defaultValue={inputData[fieldName] ?? ""} sectionTitle={title} title={fieldName} />;
          }
        });
    };
// columns={columns[curIndex]} dataSource={data[curIndex]}
    const renderData = () => {
        if(showData) return <TableDisplay style={{maxWidth: "50%"}} height={"50vh"} columns={columns[curIndex]} dataSource={data[curIndex]} />
        else return <TreeDisplay />

    }

    const menu = (
        <Menu onSelect={(info) => setCurIndex(info.key)}
        selectable
        defaultSelectedKeys={['0']}
        items={pathsToDisplay.map((path, index) => {
            return {
                key: index,
                label: path.replace(".", "")
            }
        })}
      />
    );

    return(
        <div>
          <Button onClick={() => setShowData(!showData)} > 
            {showData ? "Tree View" : "Table View" }
          </Button>
          {showData ? 
            <Dropdown overlay={menu}>
                <Typography.Link>
                    <Space>
                        Table Choices
                        <DownOutlined />
                    </Space>
                </Typography.Link>
             </Dropdown>
            :
            null
          }




          <div style={{display: "flex", flexDirection: "row"}}>
            {renderData()}
            <div style={{width: "100%"}}>
                <h1 style={{textAlign: "center"}}>{title}</h1>
                {createSectionFields()}
            </div>
          </div>
        </div>

       )

}