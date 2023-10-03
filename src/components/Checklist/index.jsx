import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import { Button, Col, Row } from 'react-bootstrap';
import { BtnSimple } from '..';
import { FaCheckSquare, FaPlus } from 'react-icons/fa';
import './style.scss'
import { FiCheckSquare, FiPlus, FiSquare, FiTrash } from 'react-icons/fi';
import moment from 'moment';

const MOCK = {
  content: 'TASK',
  checked_at: false,
  isEditing: false
}

const Checklist = forwardRef(({ handleForm }, ref) => {
  const [checklist, setChecklist] = useState();
  const [isShow, setisShow] = useState(false);
  function init(data) {
    setisShow(true)
    setChecklist(data)
  }

  useImperativeHandle(ref, () => ({
    init,
  }));

  const handleCheckboxClick = (index) => {
    const updatedChecklist = [...checklist];
    const currentItem = updatedChecklist[index];

    if (currentItem.checked_at) {
      currentItem.checked_at = false;
    } else {
      currentItem.checked_at = moment().format('DD/MM/YYYY HH:mm');
    }

    setChecklist(updatedChecklist);
  };

  const addItem = () => {
    let updatedChecklist = [...checklist];
    updatedChecklist.push({ ...MOCK, id: Math.random().toString(12).substring(2), content: 'item ' + (checklist.length + 1) });
    setChecklist(updatedChecklist);
  };

  const handleContentClick = (index) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].isEditing = true;
    setChecklist(updatedChecklist);
  };
  const removeItem = (index) => {
    const updatedChecklist = [...checklist];
    setChecklist(updatedChecklist.filter((e, i) => i !== index));
  };

  const handleContentChange = (index, event) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].content = event.target.value;
    setChecklist(updatedChecklist);
  };

  const handleContentBlur = (index) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].isEditing = false;
    setChecklist(updatedChecklist);
  };

  const calculateProgress = () => {
    if (!checklist || checklist?.length == 0) return 0;
    const completedCount = checklist.filter(item => item.checked_at).length;
    return (completedCount / checklist.length) * 100;
  };

  useEffect(() => {
    handleForm('checklist', checklist)
  }, [checklist]);
console.log(checklist)
  if (!isShow || !checklist) return null;
  return (
    <>
      <h5><FaCheckSquare style={{ marginRight: 10 }} />Checklist</h5>

      <div className='checklist'>
        <Row>
          <h6 style={{ width: 50 }}>{Math.round(calculateProgress())}%</h6>
          <Col>
            <ProgressBar
              now={calculateProgress()}
              variant={calculateProgress() === 100 ? 'success' : 'info'}
            />
          </Col>
        </Row>

        {checklist.map((item, index) => (
          <Row key={item.id} title={item.checked_at ?? null} className={"checklist-item" + (item.checked_at !== false ? " checked" : "")} style={{ textDecoration: item.checked_at ? 'line-through' : 'none' }}>
            <Col style={{ width: 50 }} md={'auto'}>
              <div onClick={() => handleCheckboxClick(index)}>
                {item.checked_at !== false ? (
                  <FiCheckSquare />
                ) : (
                  <FiSquare />
                )}
              </div>
            </Col>
            <Col>
              <span onClick={() => handleContentClick(index)}>
                {item.isEditing ? (
                  <Form.Control
                    type="text"
                    value={item.content}
                    onChange={(event) => handleContentChange(index, event)}
                    onBlur={() => handleContentBlur(index)}
                  />
                ) : (
                  item.content
                )}
              </span>
            </Col>
            <Col style={{ width: 50 }} md={'auto'}>
              <div className="trash" onClick={() => removeItem(index)} >
                <FiTrash />
              </div>
            </Col>
          </Row>

        ))}
        <Row className='flex-row-reverse mt-2'>
          <BtnSimple Icon={FiPlus} onClick={addItem}>Adicionar item</BtnSimple>
        </Row>
      </div>
    </>

  );
});



export default memo(Checklist);
