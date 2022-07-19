import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil"
import { draggedTreeJSONNodeHook, draggedTreeNodeHook, inputDataHook, popupFieldHook, treeHook } from "../../../util/Atoms"
import React, { useState } from "react"
import { Tree, Modal, Table, Input } from 'antd';
import { pathToColumn } from "../../../util/toColumn";
import { TableDisplay } from "../Table/TableDisplay";
import { getRootValue, pathToArray, pathToJSON } from "../../../util/toJSON";
import { createTreeItem } from "./TreeItem";

export const TreeDisplay = () => {
    const tree = useRecoilValue(treeHook)
    const [draggedTreeNode, setDraggedTreeNode] = useRecoilState(draggedTreeNodeHook);
    const [draggedTreeJSONNode, setDraggedTreeJSONNode] = useRecoilState(draggedTreeJSONNodeHook);
    const inputData = useRecoilValue(inputDataHook)
    const [popupField, setPopupField] = useRecoilState(popupFieldHook)
    const [columns, setColumns] = useState([])

    return (
        <>
            <Modal
                width={'auto'}
                bodyStyle={{ height: '70vh', overflow: 'scroll' }}
                onCancel={() => setPopupField({})}
                visible={Object.keys(popupField).length != 0}
                footer={null}
            >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <TableDisplay height={"50vh"} columns={columns} dataSource={draggedTreeJSONNode} style={{width: '50%', marginBottom: 20 }}/>
                    <div style={{ width: "50%", height:'100%' }}>
                        {popupField}
                    </div>
                </div>
            </Modal>

            <Tree titleRender={(node) => createTreeItem(node, inputData)} treeData={tree} draggable style={{ height: '100%', overflow: 'scroll' }} 
                onDragStart={({ event, node }) => {
                    setDraggedTreeNode(node);
                    const draggedTreeJsonNodeData = pathToJSON(node.key, inputData)
                    setColumns(pathToColumn(node.key ?? "", tree, draggedTreeJsonNodeData))
                    setDraggedTreeJSONNode(draggedTreeJsonNodeData);
                }}
            
            />

        </>

    )

}