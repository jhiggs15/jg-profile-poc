import React, { useState } from "react";
import { ArrayField } from "../Fields/ArrayField";
import { Field } from "../Fields/Field";
import { inputDataHook, sectionStateHook, treeHook } from "../../util/Atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { Button, Dropdown, Menu, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { TableDisplay } from "../Data/Table/TableDisplay";
import { pathToColumn, treeNodeToColumn } from "../../util/toColumn";
import { pathToJSON, treeToJSON } from "../../util/toJSON";
import { TreeDisplay } from "../Data/Tree/TreeDisplay";


export const ShowDataSection = ({title, schema, pathsToDisplay}) => {

  const tree = useRecoilValue(treeHook)
  const inputData = useRecoilValue(inputDataHook)
  const [showData, setShowData] =  useState(true)
  const[curIndex, setCurIndex] = useState(0)

  const columns = pathsToDisplay.map(path => pathToColumn(path, tree, inputData) )
  const data = pathsToDisplay.map(path => pathToJSON(path, inputData))

  const renderData = () => {
    if(showData) return <TableDisplay style={{maxWidth: "60%"}} height={"50vh"} columns={columns[curIndex]} dataSource={data[curIndex]} />
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

  const createSectionFields = () => {
    const sectionDataTitle = Object.keys(schema)[0]
    const sectionSchema = schema[sectionDataTitle].schema

    const arrayTitle = Object.keys(sectionSchema)[0]
    const arrayObject = sectionSchema[arrayTitle]
    const arrayMaxLength = arrayObject.maxLength
    const arraySchema  =  arrayObject.schema

    if(arrayObject.type !== "Array") return <h1>Cannot render Fields in show data section only arrays where each element has a single attribuite</h1>

    const fieldName = Object.keys(arraySchema)[0]
    const fieldObject = arraySchema[fieldName]
    const fieldMaxLength = fieldObject.maxLength

    return <ArrayField sectionDataTitle={sectionDataTitle} arrayTitle={arrayTitle} arrayMaxLength={arrayMaxLength} fieldName={fieldName} fieldMaxLength={fieldMaxLength}  />

};

  return (
    <div>
      <h1 style={{textAlign: "center"}}>{title}</h1>
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
        <div style={{ paddingLeft: 20, width: "100%"}}>
          {createSectionFields()}
          {/* <h1 style={{textAlign: "center"}}>{title}</h1> */}
        </div>
      </div>
    </div>
  )
  
}