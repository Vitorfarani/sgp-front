import AnexoItem from "@/components/AnexoItem";
import { HorizontalScrollview, ThumbnailUploader } from "@/components/index";
import { deleteProjetoObservacao, listProjetoObservacoes } from "@/services/projeto/projetoObservacoes";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Card, Row, Spinner, Stack, Tab, Tabs } from "react-bootstrap"
import { FiTrash } from "react-icons/fi";
import './style.scss'
import moment from "moment";
import { datetimeFromNow } from "@/utils/helpers/date";

const CardObservacao = ({
  alingRight = false,
  enableEdit,
  title,
  onRemove,
  content,
  createdAt,
  anexos = []

}) => {

  const created_at = useMemo(() => {
    if (!createdAt) return ''
    return datetimeFromNow(createdAt);
  }, [createdAt]);
  return (
    <Card className='card-observacao card' style={{  marginLeft: alingRight ? 'auto' : null }}>
          <Card.Header>
            <Stack direction='horizontal' gap={2}>
              <ThumbnailUploader size={30} placeholder={title} />
              <Card.Title style={{ fontSize: 16, margin: 'auto 0' }}>{title}</Card.Title>
            </Stack>
            {enableEdit && (
              <a onClick={onRemove} style={{ position: 'absolute', right: 10, top: 10 }}>
                <FiTrash color='red' />
              </a>
            )}
          </Card.Header>
          {!!content && (
            <Card.Body>
              <Card.Text dangerouslySetInnerHTML={{ __html: content }}></Card.Text>
              <div className="created-at">
                <span>{created_at}</span>
              </div>
            </Card.Body>
          )}
          {anexos.length > 0 && (
            <Card.Footer>
              <HorizontalScrollview style={{ justifyContent: 'start' }}>
                {anexos.map((anexo, index) => (
                  <AnexoItem key={index} title={anexo.title} type={anexo.type} url={anexo.url}/>
                ))}
              </HorizontalScrollview>
            </Card.Footer>
          )}
        </Card>
  )
}

export default CardObservacao;