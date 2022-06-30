import { Select, Col, Row, Input } from 'antd';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';


import { inputData } from '../inputData';

const { Option } = Select;

const skills = inputData.skills.map((skill) => {
  const { name } = skill;
  return {
    id: nanoid(),
    skill: name,
  };
});

const options = skills.map(({ id, skill }) => {
  return (
    <Option key={id} value={id}>
      {skill}
    </Option>
  );
});

export const Skills = (props) => {
  const { skillsHook } = props;
  const [selectedSkills, setSkills] = skillsHook;

  return (
    <div>
      <h3>Skills</h3>
      <Row>
        <Col span={12}>
          <Select
            mode="multiple"
            value={selectedSkills.map(({ id }) => id)}
            onChange={(ids) => {
              const selected = skills.filter(({ id }) => ids.includes(id));
              setSkills([...selected]);
            }}
            style={{ width: '100%' }}
          >
            {options}
          </Select>
        </Col>
        <Col span={12}>
          {selectedSkills.map(({ id, skill }) => {
            return (
              <Input
                value={skill}
                addonBefore="Skill"
                onChange={(e) => {
                  const { value } = e.target;
                  const skillItem = selectedSkills.find(
                    (skill) => skill.id === id
                  );
                  skillItem.skill = value;
                  setSkills([...selectedSkills]);
                }}
              />
            );
          })}
        </Col>
      </Row>
    </div>
  );
}

export default Skills;
