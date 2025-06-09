import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Background, HeaderTitle, Section } from "@/components";
import { FiPlus } from "react-icons/fi";
import { useTheme } from "@/utils/context/ThemeProvider";
import { calendarioSchema } from "./validations";
import "./style.scss";



export default function Calendario() {
  const { callGlobalDialog, callGlobalNotify } = useTheme();
  const [eventos, setEventos] = useState([
    { title: "Aniversário do Vitor 🎉", date: "2025-11-27" },
  ]);

  const abrirModalNovoEvento = () => {
    callGlobalDialog({
      title: "Novo Evento",
      yupSchema: calendarioSchema,
      data: {},
      forms: [
        {
          name: "title",
          label: "Título do Evento",
          placeholder: "Ex: Reunião, Lembrete...",
        },
        {
          name: "date",
          label: "Data",
          type: "date",
        },
      ],
      labelSuccess: "Criar",
      labelCancel: "Cancelar",
      labelSucessColor: "green",
    })
      .then((result) => {
        setEventos([...eventos, result]);
        callGlobalNotify({
          message: "Evento criado com sucesso!",
          variant: "success",
        });
      })
      .catch(() => {});
  };

  return (
    <Background>
      <HeaderTitle
        title="Calendário"
        optionsButtons={[
          {
            label: "Novo Evento",
            onClick: abrirModalNovoEvento,
            icon: FiPlus,
          },
        ]}
      />
      <Section>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          events={eventos}
          height="auto"
        />
      </Section>
    </Background>
  );
}
