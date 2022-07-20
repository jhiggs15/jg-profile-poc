
import React, { useRef, useState } from "react"
import { Table, Tag, Input, Button, Select, List, Space } from 'antd';
import { useRecoilState } from "recoil";
import { sectionStateHook } from "../../util/Atoms";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
/**
 * name
 * description
 * imageLink
 * category
 * rating
 */

const iterateWorkData = (workDatas, workDataAttribute, companyNameAttribute, skillsAttribute, map) => {
    for(let workData of workDatas) {
        const name = workData[companyNameAttribute]
        for(let skill of workData[skillsAttribute]) {
            let foundSkill = map.get(skill.name)
            if(typeof foundSkill == 'undefined') foundSkill = createNewSkillItem(skill.name, skill.rating, skill.category[0].value, map)
            if(foundSkill.source[0] == "Skill Assesment"){
                foundSkill.source = [workDataAttribute]
                foundSkill.experience = [name]
            } 
            else{
                foundSkill.source.push(workDataAttribute) 
                foundSkill.experience.push(name) 

            } 

        }

    }

}

const ratingToString = (rating) => {
    if(rating <= 1) return "Knowlegeable"
    else if(rating == 2) return "Proficient"
    else if(rating >= 3) return "Lead/Teach"

}

const createNewSkillItem = (name, rating, category, map) => {
    const skill = {name, rating, category}
    skill.key = name
    skill.source =["Skill Assesment"] 
    skill.experience = ["Skill Assesment"]
    map.set(name, skill)
    return skill
}

export const combineSkillsData = (allSkills, JGProjects, prevWork) => {
    const map = new Map()

    allSkills.forEach(skill => {
        createNewSkillItem(skill.name, skill.rating, skill.category[0].value, map)

    })

    iterateWorkData(JGProjects.data, "JG Project", JGProjects.companyName, JGProjects.skills, map)
    iterateWorkData(prevWork.data, "Previous Work", prevWork.companyName, prevWork.skills, map)

    return Array.from(map.values())    
}

const InputTag = ({inputValue, setInputValue, setInputVisible, inputVisible, addItem, hasSkill}) => {
    const isError = hasSkill || inputValue ==""
    const errorMessage = hasSkill ? "This skill already exists" : (inputValue == "" ? "Cannot add the Empty Skill": "")
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            {inputVisible && (
                <div style={{display: "flex"}}>
                    <Input
                        status= {isError ? "error" : null}
                        onBlur={() => setInputVisible(false)}
                        type="text"
                        size="small"
                        style={{ minHeight: 46, width: 100 }}
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        onPressEnter={() =>{
                            if(!isError) {
                                addItem(inputValue);
                                setInputValue("");
                                setInputVisible(false)
                            }

                        }}
                    />
                    {isError ? 
                        <p style={{marginTop: "revert", margin: 0, color: "red", paddingLeft: 5, alignSelf: "center"}}>
                            {errorMessage}
                        </p>
                        :
                        null
                    }
                </div>

            )}
            {!inputVisible && (
                <Tag style={{marginTop: 5, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 40}} onClick={() => setInputVisible(true)} className="site-tag-plus">
                    <PlusOutlined /> New Tag
                </Tag>
            )}
        </div>
    )

}


export const SkillsDisplay = ({allSkills, JGProjects, prevWork, sectionDataTitle, arrayTitle, fieldName, arrayMaxLength, fieldNameMaxLength }) => {
    const [section, setSection] = useRecoilState(sectionStateHook);
    const [inputValue, setInputValue] = useState([])
    const [inputVisible, setInputVisible] = useState(false);
    const [customTags, setCustomTags] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
      };

      const renderTags = () => {
        if(containsItem("")) removeItem("")
        const tagFromSection = section[sectionDataTitle][arrayTitle].map(item => {
            return (
                <Tag style={{marginTop: 5}} onClick={() => removeItem(item[fieldName])}>
                    <div style={{display: "flex", flexDirection : "row", alignItems: "center" }}>
                        <p style={{marginTop: "revert", paddingRight : 10}}>{item[fieldName]}</p>
                        <DeleteOutlined style={{ fontSize: '14px'}}  />
                    </div>

                </Tag>
            )
        })

        return tagFromSection

    }

    const containsItem = (value) => {
        return typeof section[sectionDataTitle][arrayTitle].find(item => item[fieldName] == value) != "undefined"
    }

    const removeItem = (value) => {
        const newSection = { ...section };
        const newSectionItem = { ...newSection[sectionDataTitle] };
        const newCustomTags = [...customTags].filter((item) => item != value)
        const newArray = [...newSectionItem[arrayTitle]].filter((item) => item[fieldName] != value)
        newSectionItem[arrayTitle] = newArray;
        newSection[sectionDataTitle] = newSectionItem;
        setCustomTags(newCustomTags)
        setSection(newSection)
    }
    const addItem = (value, isCustomTag) => {
        const newSection = { ...section };
        const newSectionItem = { ...newSection[sectionDataTitle] };
        if(isCustomTag) {
            const newTags = customTags
            newTags.push(value)
            setCustomTags(newTags)
        }
        const newArray = [...newSectionItem[arrayTitle]];
        newArray.push({[fieldName] : value})
        newSectionItem[arrayTitle] = newArray;
        newSection[sectionDataTitle] = newSectionItem;

        setSection(newSection);
    };
    
    const addItems = (values) => {
        const newSection = { ...section };
        const newSectionItem = { ...newSection[sectionDataTitle] };
        const customTagsAsItems = customTags.map(item => {return {[fieldName] : item}}) 
        const newArray = [...customTagsAsItems];
        values.forEach((value) => {
            newArray.push({[fieldName] : value})
        })
        newSectionItem[arrayTitle] = newArray;
        newSection[sectionDataTitle] = newSectionItem;

        setSection(newSection);
    }

    const handleChange = (selectedRowKeys) => {
        addItems(selectedRowKeys)
    };


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div
            style={{
              padding: 8,
            }}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() =>  handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() =>{handleReset(clearFilters); handleSearch(selectedKeys, confirm, dataIndex)} }
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#1890ff' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },

      });



    const vals = combineSkillsData(allSkills, JGProjects, prevWork)

    const categoryFilterItems = Array.from(new Set(vals.map(item => item.category))).map(item =>({text: item, value: item}) )
    const experienceSet = new Set()
    vals.forEach(item => {
        if(Array.isArray(item.experience)) item.experience.forEach(subItem => experienceSet.add(subItem))
        else experienceSet.add(item.experience)
    })
    const experienceFilterItems = Array.from(experienceSet).map(item =>({text: item, value: item}) )
    const sourceFilterItems = ["JG Project", "Previous Work", "Some Experience", "Skill Assesment"].map(item =>({text: item, value: item}) )



    const columns = [
        {
            title: "Skill Name", dataIndex: "name",
            ...getColumnSearchProps('name')
        }, 
        {
            title: "Category", dataIndex: "category",
            filters: categoryFilterItems, 
            filterMultiple: true,
            onFilter: (value, record) =>  record.category == value
        },
        {
            title: "Proficency", dataIndex: "rating", 
            render: (record) => ratingToString(record),
            sorter: {
                compare: (a, b) => a.rating - b.rating, 
                multiple: 2
            },
            sortDirections: ['descend'],
        },
        {
            title: "Source", dataIndex: "source", 
            filters: sourceFilterItems,
            sorter:{
                compare: (a, b) => a.source.length - b.source.length,
                multiple: 1
            },
            sortDirections: ['descend'],
            onFilter: (value, record) =>  {
                if(value == "Some Experience") return record.source.includes("JG Project") || record.source.includes("Previous Work")
                else return record.source.includes(value)
            },
            render: (record, index) => {
                let item = record
                if(!Array.isArray(item)) item = [item]
                return (
                    <List itemLayout="horizontal" dataSource={item} 
                        renderItem={listItem => <List.Item>{listItem}</List.Item>}
                    />
            )}
        },
        {
            title: "Experience", dataIndex: "experience", 
            filters: experienceFilterItems,
            onFilter: (value, record) =>  record.experience.includes(value),
            sorter:{
                compare: (a, b) => a.experience.length - b.experience.length,
                multiple: 1
            },
            sortDirections: ['descend'],
            render: (record, index) => {
                return (
                    <List itemLayout="horizontal" dataSource={record} 
                        renderItem={listItem => <List.Item>{listItem}</List.Item>}
                    />

                )
            }
        },
    ]

    const rowSelection = {
        type: 'checkbox',
        onChange: handleChange,
        getCheckboxProps: (record) => ({ name: record.name }),
        selectedRowKeys: section[sectionDataTitle][arrayTitle].map(item => {
            return item[fieldName]
        })
      };

    return (
        <div >
            <div style={{display: "flex", flexDirection: "row", flexWrap: 'wrap', paddingBottom: 10, maxHeight: 120, overflow: 'scroll'}}>
                <InputTag inputValue={inputValue} setInputValue={setInputValue} inputVisible={inputVisible} 
                    setInputVisible={setInputVisible} addItem={(value) => addItem(value, true)} hasSkill={containsItem(inputValue)} />
                {renderTags()}

            </div>
            <Table scroll={{ y: "60vh" }}
                rowSelection={{...rowSelection}}
                dataSource={vals} columns={columns} />

        </div>
    )

     
}

