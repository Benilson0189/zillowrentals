import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function Invite() {
  const { token } = useParams();

  // Redireciona automaticamente para a rota já existente /r/:inviteCode
  return <Navigate to={`/r/${token}`} replace />;
}
