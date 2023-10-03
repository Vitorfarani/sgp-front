import { Background, Section } from "@/components/index";
import { useRouteError } from "react-router-dom";

export default function NotFound() {
  return (
    <Background>
      <Section>

      <h1>Oops!</h1>
      <p>Página não encontrada.</p>
      </Section>
    </Background>
  );
}