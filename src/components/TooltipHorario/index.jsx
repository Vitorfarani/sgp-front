import React from 'react';
import { BadgeColor } from "@/components/index";

// Função para determinar a cor com base no label
const getColor = (label) => {
  switch (label) {
    case "ACIMA":
      return "orange";
    case "ATENÇÃO":
      return "purple";
    case "SEM REGISTRO":
      return "red";
    case "NA MÉDIA":
      return "green";
    default:
      return "";
  }
};

const TooltipHorario = ({ horarioLabels }) => {

  const color = horarioLabels ? getColor(horarioLabels.label) : '';

  return (
    <>
      {horarioLabels && (
        <>
          <BadgeColor color={color}>{horarioLabels.label}</BadgeColor>
        </>
      )}
    </>
  );
};

export default TooltipHorario;
