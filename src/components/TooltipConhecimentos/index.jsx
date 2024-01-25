import React, { useState } from 'react';
import { Container, Tooltip } from 'react-bootstrap';
import './style.scss';
import { BadgeColor, HorizontalScrollview, PuzzleIcon } from '..';
import CardConhecimento from '@/screens/Colaboradores/components/CardConhecimento';
import { useDebounce } from 'use-debounce';

const TooltipConhecimentos = ({ colaborador, style, title, showOnlyId }) => {
  const [focused, setFocused] = useState(false);
  const [debouncedValue] = useDebounce(focused, 400);

  const FilteredConhecimentos = () => {
    console.log(showOnlyId)
    if (!!showOnlyId) {
      
      let colaboradorFinded = colaborador.colaborador_conhecimento.find((cc) => showOnlyId == cc.conhecimento.id)
      if(!colaboradorFinded) return null
      return (
        <div className='conhecimento'>
          <PuzzleIcon color={colaboradorFinded.conhecimento_nivel?.color} size={16} />
          <BadgeColor color={colaboradorFinded.conhecimento.color}>{colaboradorFinded.conhecimento.nome}</BadgeColor>
        </div>

      )
    }
    return colaborador.colaborador_conhecimento?.map((cc, i) => (
      <div className='conhecimento'>
        <PuzzleIcon color={cc.conhecimento_nivel?.color} size={16} />
        <BadgeColor color={cc.conhecimento.color}>{cc.conhecimento.nome}</BadgeColor>
      </div>

    ))
  }
  return (
    <div style={style} onMouseEnter={() => setFocused(true)} onMouseLeave={() => setFocused(false)}>
      <span>{title}</span>

      {debouncedValue && (
        <div className='tooltip-conhecimentos' style={{
          position: 'relative',
        }}>
          <FilteredConhecimentos />

        </div>

      )}
    </div>
  );
}

export default TooltipConhecimentos;