import React, { useState } from 'react';
import { Col, Row, Input } from "antd";
import {inputData} from "../inputData"

export const BasicInfo = (props) => {
  const { name, tense_title, biography } = inputData;

  const { nameHook, titleHook, bioHook } = props;

  const [nameValue, setName] = nameHook;
  const [title, setTitle] = titleHook;
  const [bio, setBio] = bioHook;

  return (
    <div>

      <Row>
        <Col span={12}>{name}</Col>
        <Col span={12}>
          <Input
            value={nameValue}
            addonBefore="Name"
            onChange={e => {
              setName(e.target.value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>{tense_title}</Col>
        <Col span={12}>
          <Input
            addonBefore="Title"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}> {biography}</Col>
        <Col span={12}>
          <Input.TextArea
            addonBefore="Bio"
            rows={10}
            value={bio}
            onChange={e => {
              setBio(e.target.value);
            }}
          />
        </Col>
      </Row>
    </div>
  );

}