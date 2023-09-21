import { Overlay, Section } from '@/components/index';
import React, { useRef, useEffect } from 'react';
import { CloseButton } from 'react-bootstrap';
// const data = [
//   {
//       "id": 1,
//       "nome": "PRESIDENCIA",
//       "sigla": "PRE",
//       "responsavel_id": null,
//       "subordinacao_id": null,
//       "created_at": "2023-09-15T09:25:52.000000Z",
//       "updated_at": "2023-09-15T09:25:52.000000Z",
//       "created_by": null,
//       "created_by_name": null,
//       "updated_by": null,
//       "updated_by_name": null,
//       "active": 1,
//       "deleted_at": null,
//       "subordinacao": null,
//       "responsavel": null
//   },
//   {
//       "id": 2,
//       "nome": "VICE",
//       "sigla": "VICE",
//       "responsavel_id": null,
//       "subordinacao_id": 1,
//       "created_at": "2023-09-15T09:26:36.000000Z",
//       "updated_at": "2023-09-15T09:26:49.000000Z",
//       "created_by": null,
//       "created_by_name": null,
//       "updated_by": null,
//       "updated_by_name": null,
//       "active": 1,
//       "deleted_at": null,
//       "subordinacao": {
//           "id": 1,
//           "nome": "PRESIDENCIA",
//           "sigla": "PRE",
//           "responsavel_id": null,
//           "subordinacao_id": null,
//           "created_at": "2023-09-15T09:25:52.000000Z",
//           "updated_at": "2023-09-15T09:25:52.000000Z",
//           "created_by": null,
//           "created_by_name": null,
//           "updated_by": null,
//           "updated_by_name": null,
//           "active": 1,
//           "deleted_at": null
//       },
//       "responsavel": null
//   },
//   {
//       "id": 3,
//       "nome": "DIRETORIA",
//       "sigla": "DIRETORIA",
//       "responsavel_id": null,
//       "subordinacao_id": 2,
//       "created_at": "2023-09-15T09:27:01.000000Z",
//       "updated_at": "2023-09-15T09:27:01.000000Z",
//       "created_by": null,
//       "created_by_name": null,
//       "updated_by": null,
//       "updated_by_name": null,
//       "active": 1,
//       "deleted_at": null,
//       "subordinacao": {
//           "id": 2,
//           "nome": "VICE",
//           "sigla": "VICE",
//           "responsavel_id": null,
//           "subordinacao_id": 1,
//           "created_at": "2023-09-15T09:26:36.000000Z",
//           "updated_at": "2023-09-15T09:26:49.000000Z",
//           "created_by": null,
//           "created_by_name": null,
//           "updated_by": null,
//           "updated_by_name": null,
//           "active": 1,
//           "deleted_at": null
//       },
//       "responsavel": null
//   },
//   {
//       "id": 4,
//       "nome": "GFS",
//       "sigla": "GFS",
//       "responsavel_id": null,
//       "subordinacao_id": 3,
//       "created_at": "2023-09-15T09:27:47.000000Z",
//       "updated_at": "2023-09-15T09:27:47.000000Z",
//       "created_by": null,
//       "created_by_name": null,
//       "updated_by": null,
//       "updated_by_name": null,
//       "active": 1,
//       "deleted_at": null,
//       "subordinacao": {
//           "id": 3,
//           "nome": "DIRETORIA",
//           "sigla": "DIRETORIA",
//           "responsavel_id": null,
//           "subordinacao_id": 2,
//           "created_at": "2023-09-15T09:27:01.000000Z",
//           "updated_at": "2023-09-15T09:27:01.000000Z",
//           "created_by": null,
//           "created_by_name": null,
//           "updated_by": null,
//           "updated_by_name": null,
//           "active": 1,
//           "deleted_at": null
//       },
//       "responsavel": null
//   }
// ]
const CanvasTree = ({ onClose, data }) => {
  const section = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {

    const HSection = section.current.clientHeight;
    const Wsection = section.current.clientWidth;

    // Aplicar a altura e o tamanho na div2
    if (canvasRef.current) {
      canvasRef.current.height = `${HSection}`;
      canvasRef.current.width = `${Wsection}`;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    // A função de desenho da árvore será chamada aqui
    drawTree();

    // Adicione os event listeners para zoom e pan
    canvas.addEventListener('wheel', handleZoom);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('wheel', handleZoom);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const drawTree = () => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Define a largura e altura de cada caixa de setor
    const boxWidth = 80;
    const boxHeight = 40;
    const padding = 20; // Espaço entre as caixas

    // Define as posições iniciais para desenhar a árvore
    const startX = ctx.canvas.width / 2 - boxWidth / 2;
    let startY = padding;

    // Função para desenhar um setor e suas conexões recursivamente
    const drawNode = (node, x, y) => {
      // Desenha a caixa do setor
      ctx.beginPath();
      // ctx.rect(x, y, boxWidth, boxHeight);
      ctx.roundRect(x, y, boxWidth, boxHeight, [40]);

      ctx.strokeStyle = 'grey';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Escreve a sigla do setor no centro da caixa
      ctx.font = '14px Arial';
      ctx.fillStyle = 'grey';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.sigla, x + boxWidth / 2, y + boxHeight / 2);

      // Calcula a posição para o próximo nível na árvore
      const nextY = y + boxHeight + padding;

      const subsNodes = data.filter((n) => node.id === n.subordinacao_id);
      // Desenha linhas para conectar este setor aos seus subordinados
      if (!subsNodes) {
        return
      }
      const subNodes = data.filter((n) => node.id === n.subordinacao_id);

      subNodes.forEach((subNode, index) => {
        const subX = startX + (boxWidth + padding) * index;
        const subY = nextY;

        ctx.beginPath();
        ctx.moveTo(x + boxWidth / 2, y + boxHeight);
        ctx.lineTo(subX + boxWidth / 2, subY);
        ctx.stroke();

        // Chama a função recursivamente para desenhar os subordinados
        drawNode(subNode, subX, subY);
      });
    };

    // Começa o desenho a partir do primeiro nó (topo da árvore)
    const rootNode = data.find((node) => !node.subordinacao_id);
    if (rootNode) {
      drawNode(rootNode, startX, startY);
    }
  };

  const handleZoom = (event) => {
    // Lógica para implementar o zoom
    // Use event.deltaY para calcular o zoom
  };

  const handleMouseDown = (event) => {
    // Lógica para iniciar o pan
    // Use event.clientX e event.clientY para obter a posição inicial do mouse
  };

  const handleMouseUp = () => {
    // Lógica para parar o pan
  };

  return (
    <Overlay>
      <section ref={section} className={`section  shadow-sm bg-body-tertiary`} style={{ width: '90vw', height: '90vh' }}>
        <CloseButton onClick={onClose} />
        <canvas ref={canvasRef} />
      </section>
    </Overlay>
  )
};

export default CanvasTree;
