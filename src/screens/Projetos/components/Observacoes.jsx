import CardObservacao from "@/components/CardObservacao";
import { useAuth } from "@/utils/context/AuthProvider";
import { memo } from "react";
import { Spinner } from "react-bootstrap"

const Observacoes = memo(({ isLoading, observacoes, onRemove }) => {
  const { user } = useAuth();

  function isOwn(colaborador) {
    return user.id === colaborador.id
  }

  return (
    <div className="list-observacao">
      {isLoading && (
        <Spinner />
      )}
      <div className="overflow-scroll-gradient">
        <div class="overflow-scroll-gradient__scroller">
          {observacoes.map((o, i) => (
            <CardObservacao
              key={i}
              alingRight={isOwn(o.colaborador)}
              enableEdit={isOwn(o.colaborador)}
              title={o.colaborador.nome}
              onRemove={onRemove}
              content={o.content}
              anexos={o.anexos} />
          ))}
        </div>
      </div>
    </div>
  )
})

export default Observacoes;