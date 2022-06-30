import { Row, Col, Select, Input, Button } from 'antd';
import { nanoid } from 'nanoid';
import {inputData} from "../inputData"
const { previousWorkConnection, nonJGProjects } = inputData;
const { edges } = previousWorkConnection;
import React, { useState } from 'react';


const workHistory = edges.map((edge) => {
  const { companyName } = edge.node;
  const { role, description, startDate, endDate } = edge;
  return {
    id: nanoid(),
    name: companyName,
    role,
    description,
    startDate,
    endDate,
  };
});

const projectHistory = nonJGProjects.map((project) => {
  const { projectFullName, usesSkillConnection } = project;
  const { edges } = usesSkillConnection;

  const skills = edges.map((edge) => {
    const { rating } = edge;
    const { name } = edge.node;
    return {
      name,
      rating,
    };
  });

  return {
    id: nanoid(),
    name: projectFullName,
    skills,
  };
});

projectHistory.sort((a, b) => {
  return b.skills.length - a.skills.length;
});

export const Experience = (props) => {
  const { expHook } = props;
  const [exp, setExp] = expHook;

  return (
    <div>
      <h1>Experience</h1>
      <Row>
        <Col span={12}>
          <h3> Work History </h3>
          {workHistory.map(
            ({ id, name, role, description, startDate, endDate }) => {
              return (
                <div key={id}>
                  {name} - {role} ({`${startDate} - ${endDate}`})
                  <p>{description}</p>
                </div>
              );
            }
          )}

          <h3>Projects</h3>
          <ul>
            {projectHistory.map(({ id, name, skills }) => {
              return (
                <li key={id}>
                  {name}
                  <ul>
                    {skills.map(({ id, name, rating }) => {
                      return (
                        <li key={id}>
                          {name} - {rating}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <ul style={{ textAlign: 'left' }}>
            {exp.map(({ id, item }) => {
              return (
                <li key={id}>
                  <Input.Group>
                    <Input.TextArea
                      onChange={(e) => {
                        const { value } = e.target;
                        const expItem = exp.find((exp) => exp.id === id);
                        expItem.item = value;
                        setExp([...exp]);
                      }}
                      value={item}
                      style={{ width: 'calc(100% - 100px)' }}
                    />
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setExp([...exp.filter((exp) => exp.id !== id)]);
                      }}
                    >
                      Remove
                    </Button>
                  </Input.Group>
                </li>
              );
            })}
          </ul>

          <Button
            onClick={(e) => {
              setExp([
                ...exp,
                {
                  id: nanoid(),
                  item: '',
                },
              ]);
            }}
          >
            Add Experience
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Experience;
