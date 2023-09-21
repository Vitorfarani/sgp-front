import { Overlay, Section } from '@/components/index';
import React, { useRef, useEffect, useState } from 'react';
import { CloseButton } from 'react-bootstrap';
import Tree from 'react-d3-tree';

const SetorTree = ({ onClose, data }) => {
  const section = useRef(null);
  const [HSection, setHSection] = useState(0);
  const [WSection, setWSection] = useState(0);

  useEffect(() => {
    setHSection(section.current.clientHeight)
    setWSection(section.current.clientWidth)
  },[])
   
  function nestDataBySubordinacaoId(data, parentId) {
    const childrens = [];

    for (const item of data) {
      if (item.subordinacao_id === parentId) {
        const child = {
          name: item.sigla,
          attributes: {
            nome: item.nome,
            responsavel: item.responsavel ? item.responsavel.nome : 'Sem Respónsável',
          },
          children: nestDataBySubordinacaoId(data, item.id)
        };
        childrens.push(child);
      }
    }

    return childrens;
  }

  const orgChart = {
    name: 'PRODERJ',
    children: nestDataBySubordinacaoId(data, null)
  };


  return (
    <Overlay>
      <section ref={section} id="treeWrapper" className={`section  shadow-sm bg-body-tertiary`} style={{ width: '90vw', height: '90vh' }}>
        <CloseButton onClick={onClose} />
        {(HSection && WSection) &&  (
          <Tree data={orgChart} orientation='vertical'  pathFunc={'step'} separation={{siblings: 3, nonSiblings: 2}} translate={{x: WSection / 2, y: 100}} />
        )}
      </section>
    </Overlay>
  )
};

export default SetorTree;
