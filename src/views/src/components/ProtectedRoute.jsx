import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Component bảo vệ route: chuyển về login nếu chưa đăng nhập
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
