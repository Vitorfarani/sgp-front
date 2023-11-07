import React, { useState } from 'react';
import { Container, Tooltip } from 'react-bootstrap';
import './style.scss';
import { BadgeColor, HorizontalScrollview, PuzzleIcon } from '..';
import CardConhecimento from '@/screens/Colaboradores/components/CardConhecimento';
import { useDebounce } from 'use-debounce';

const TooltipConhecimentos = ({ colaborador }) => {
  const [focused, setFocused] = useState(false);
  const [debouncedValue] = useDebounce(focused, 400);
  return (
    <div  onMouseEnter={() => setFocused(true)} onMouseLeave={() => setFocused(false)}>
      <span>{colaborador.nome}</span>
      {debouncedValue && (
        <div className='tooltip-conhecimentos' style={{  position: 'relative',
        }}>
          {colaborador.colaborador_conhecimento?.map((cc, i) => (
            <div className='conhecimento'>
                <PuzzleIcon color={cc.conhecimento_nivel?.color} size={16}/>
                <BadgeColor color={cc.conhecimento.color}>{cc.conhecimento.nome}</BadgeColor>
            </div>
          
          ))}
        </div>

      )}
    </div>
  );
}

export default TooltipConhecimentos;