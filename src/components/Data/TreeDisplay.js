import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil"
import { draggedTreeJSONNodeHook, draggedTreeNodeHook, inputDataHook, popupFieldHook, treeHook } from "../../util/Atoms"
import React, { useState } from "react"
import { Tree, Modal, Table, Input } from 'antd';
import { treeToJSON } from "../../util/TreeToJSON";
import { treeNodeToColumn } from "../../util/TreeNodeToColumn";
import { TableDisplay } from "./TableDisplay";

export const TreeDisplay = () => {
    const tree = useRecoilValue(treeHook)
    const [draggedTreeNode, setDraggedTreeNode] = useRecoilState(draggedTreeNodeHook);
    const [draggedTreeJSONNode, setDraggedTreeJSONNode] = useRecoilState(draggedTreeJSONNodeHook);
    const inputData = useRecoilValue(inputDataHook)
    const [popupField, setPopupField] = useRecoilState(popupFieldHook)

    return (
        <>
            <Modal
                width={'auto'}
                bodyStyle={{ height: '70vh', overflow: 'scroll' }}
                onCancel={() => setPopupField({})}
                visible={Object.keys(popupField).length != 0}
                footer={null}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <TableDisplay height={"20vh"} columns={treeNodeToColumn(draggedTreeNode)} dataSource={draggedTreeJSONNode} style={{height: '30vh', marginBottom: 20 }}/>
                    <div style={{ height: '30vh', overflow: 'scroll' }}>
                        {popupField}
                    </div>
                </div>
            </Modal>

            <Tree treeData={tree} draggable style={{ height: '100%', overflow: 'scroll' }} 
                onDragStart={({ event, node }) => {
                    setDraggedTreeNode(node);
                    setDraggedTreeJSONNode(treeToJSON(node, inputData, node.title));
                }}
            
            />

        </>

    )

}