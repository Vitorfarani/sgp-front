import CardObservacao from "@/components/CardObservacao";
import { useAuth } from "@/utils/context/AuthProvider";
import { memo, useEffect, useRef } from "react";
import { Row, Spinner } from "react-bootstrap"
import './style.scss';

const Observacoes = memo(({ isLoading, observacoes, onRemove }) => {
  const { user } = useAuth();
  const listaRef = useRef(null);

  function isOwn(id) {
    return user?.colaborador?.id === id
  }

  useEffect(() => {
    if (listaRef.current) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }
  }, [observacoes?.length]);

  return (
    <div className="list-observacao">
      {isLoading && (
        <Spinner />
      )}
      {observacoes?.length ? (
        <div className="overflow-scroll-gradient">
          <div className="overflow-scroll-gradient__scroller"  ref={listaRef}>
            {observacoes.map((o, i) => (
              <CardObservacao
                key={i}
                alingRight={isOwn(o.colaborador.id)}
                enableEdit={isOwn(o.colaborador.id)}
                createdAt={o.created_at}
                title={o.colaborador.nome}
                onRemove={() => onRemove(o.id)}
                content={o.conteudo}
                // anexos={o.anexos} 
                />
            ))}
          </div>
        </div>
      ) : (
        <Row>
          <span></span>
        </Row>
      )}
    </div>
  )
})

export default Observacoes;