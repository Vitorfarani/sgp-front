import React, { useState } from 'react';
import './style.scss'; // Certifique-se de criar este arquivo CSS para estilização
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';

function ClipboardContainer({children = ''}) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(children)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000); // Define o tempo para reverter a animação após 1 segundo
      })
      .catch(err => {
        console.error('Erro ao copiar para a área de transferência:', err);
      });
  };
  if(!children) return null;
  return (
    <div className="clipboard-container" onClick={handleCopyClick}>
      <span>{children}</span>
      <div >
        {!copied ? <FaClipboard/> : <FaClipboardCheck style={{color: 'var(--bs-success)'}}/>}
      </div>
    </div>
  );
}

export default ClipboardContainer;
