import { Background, HeaderTitle, Section, Table } from "@/components/index";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const MOCK = {
  id: 1,
  nome: 'Projeto A',
  responsavel: 'João',
  fase: 1,
  situacao: 0 
}

export default function Projeto() {
  const navigate = useNavigate();
  let params = useParams();
  const [formData, setformData] = useState(MOCK);
  
  useEffect(() => {
    console.log(params)
  }, [params]);

  return (
    <Background>
      <HeaderTitle title="Projeto" breadcrumbBlockeds={['editar']} />
      <Section>
        {}
      </Section>
    </Background>
  );
}