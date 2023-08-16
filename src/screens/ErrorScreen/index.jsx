import { useRouteError } from "react-router-dom";

export default function ErrorScreen() {
  const error = useRouteError();
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Desculpe, Houve um erro inexperado na aplicação.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}