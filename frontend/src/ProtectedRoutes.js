import { Navigate } from 'react-router-dom';
import NotFound from './components/feedback/notFound'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import { useAuth } from './contexts/AuthContext';
function ProtectedRoute({ component: Component, ...rest }) {
  const { user } = useAuth();
  if (user) {
    return <Component {...rest} />
  } else {
    return <Navigate to="/login" replace />;
  }

}

const AdminProtectedRoutes = ({ allowedRoles, component: Component, ...props }) => {
  const { user } = useAuth();
  // Check if the user has an allowed role
  if (!user) {
    // Redirect or handle unauthorized access
    return <Navigate to="/login" replace />
  }
  else if (!allowedRoles.includes(user.role)){
    return <NotFound status="401" message="Unauthorized Access" color="red"/>;
  }

  // Render the protected component if the user has the allowed role
  return <Component {...props}/>;
};
export { AdminProtectedRoutes, ProtectedRoute };
