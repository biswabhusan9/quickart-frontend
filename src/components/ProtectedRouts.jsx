import { Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const ProtectedRouts = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="loader"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRouts;
