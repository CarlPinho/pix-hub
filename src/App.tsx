// Em: src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// O BrowserRouter FOI REMOVIDO DAQUI
import { Routes, Route } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import CustomerHome from "./pages/CustomerHome";
import PixTransferForm from "./pages/PixTransferForm";
import FraudDashboard from "./pages/FraudDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* A tag <BrowserRouter> foi removida daqui */}
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/pix-transfer" element={<PixTransferForm />} />
        <Route path="/analyst" element={<FraudDashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* E daqui */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;