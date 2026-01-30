import Invite from "./Invite"; // <- nova rota de convite
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Rentals from "./pages/Rentals";
import MyRentals from "./pages/MyRentals";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Withdrawals from "./pages/Withdrawals";
import Deposits from "./pages/Deposits";
import DepositFlow from "./pages/DepositFlow";
import WithdrawalFlow from "./pages/WithdrawalFlow";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Bonus from "./pages/Bonus";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Short invite link redirect */}
            <Route path="/r/:inviteCode" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/rentals" element={
              <ProtectedRoute>
                <Rentals />
              </ProtectedRoute>
            } />
            <Route path="/my-rentals" element={
              <ProtectedRoute>
                <MyRentals />
              </ProtectedRoute>
            } />
            {/* Legacy route redirect */}
            <Route path="/investments" element={<Navigate to="/my-rentals" replace />} />
            <Route path="/team" element={
              <ProtectedRoute>
                <Team />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/withdrawals" element={
              <ProtectedRoute>
                <Withdrawals />
              </ProtectedRoute>
            } />
            <Route path="/deposits" element={
              <ProtectedRoute>
                <Deposits />
              </ProtectedRoute>
            } />
            <Route path="/deposit" element={
              <ProtectedRoute>
                <DepositFlow />
              </ProtectedRoute>
            } />
            <Route path="/withdrawal" element={
              <ProtectedRoute>
                <WithdrawalFlow />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/bonus" element={
              <ProtectedRoute>
                <Bonus />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/terms" element={
              <ProtectedRoute>
                <TermsOfUse />
              </ProtectedRoute>
            } />
            <Route path="/privacy" element={
              <ProtectedRoute>
                <PrivacyPolicy />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <AboutUs />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
