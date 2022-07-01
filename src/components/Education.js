import React, { useState } from 'react';

import { Col, Row, Select, Input } from "antd";
import { nanoid } from "nanoid";
import {inputData} from "../inputData"
const { attendedConnection } = inputData;
const { edges } = attendedConnection;

const sourceEducation = edges.map(edge => {
  const { educationName } = edge.node;
  const { degreeName } = edge;
  return {
    id: nanoid(),
    school: educationName,
    degree: degreeName,
  };
});

const { Option } = Select;

const options = sourceEducation.map(({ id, school, degree }) => {
  return (
    <Option key={id} value={id}>
      {school}, {degree}
    </Option>
  );
});

export const Education = (props) => {
  const { eduHook } = props;
  const [edu, setEdu] = eduHook;

  return (
    <div>
      <h3>Education</h3>

      <Row>
        <Col span={12}>
          <Select
            value={edu.id}
            onChange={id => {
              const selected = sourceEducation.find(item => item.id === id);
              setEdu({ ...selected });
            }}
            style={{ width: "100%" }}
          >
            {options}
          </Select>
        </Col>
        <Col span={12}>
          <Input
            addonBefore="School"
            value={edu.school}
            onChange={e => {
              const { value } = e.target;
              edu.school = value;
              setEdu({ ...edu });
            }}
          />

          <Input
            addonBefore="Degree"
            value={edu.degree}
            onChange={e => {
              const { value } = e.target;
              edu.degree = value;
              setEdu({ ...edu });
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Education;
