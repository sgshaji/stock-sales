import { useAuth } from "@/contexts/AuthContext";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";

const LandingOrDashboard = () => {
  const { user } = useAuth();

  // Show landing page if not authenticated, dashboard if authenticated
  return user ? <Index /> : <Landing />;
};

export default LandingOrDashboard;