import CardObservacao from "@/components/CardObservacao";
import { useAuth } from "@/utils/context/AuthProvider";
import { memo } from "react";
import { Row, Spinner } from "react-bootstrap"
import './style.scss';

const Observacoes = memo(({ isLoading, observacoes, onRemove }) => {
  const { user } = useAuth();

  function isOwn(id) {
    return user?.id === id
  }

  return (
    <div className="list-observacao">
      {isLoading && (
        <Spinner />
      )}
      {observacoes?.length ? (
        <div className="overflow-scroll-gradient">
          <div className="overflow-scroll-gradient__scroller">
            {observacoes.map((o, i) => (
              <CardObservacao
                key={i}
                alingRight={isOwn(o.onwer.id)}
                enableEdit={isOwn(o.onwer.id)}
                title={o.onwer.name}
                onRemove={() => onRemove(o.id)}
                content={o.content}
                anexos={o.anexos} />
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