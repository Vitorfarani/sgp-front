import { useRouteError } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Página não encontrada.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}