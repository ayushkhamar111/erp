import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Sales from "./pages/Sales";
import CreateSales from "./pages/CreateSales";
import EditSales from "./pages/EditSales";
import Purchases from "./pages/Purchases";
import CreatePurchase from "./pages/CreatePurchase";
import EditPurchase from "./pages/EditPurchase";
import Contacts from "./pages/Contacts";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Units from "./pages/Units";
import CreateUnits from "./pages/CreateUnits";
import EditUnits from "./pages/EditUnits";
import CreateAccountType from "./pages/CreateAccounttype";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AccountType from "./pages/AccountType.tsx";
import Item from "./pages/Item.tsx";
import CreateItem from "./pages/CreateItem.tsx";
import EditItem from "./pages/EditItem.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              // <ProtectedRoute>
                <Index />
              // </ProtectedRoute>
            } />
            <Route path="/item" element={
            //  <ProtectedRoute>
                <Item />
             // </ProtectedRoute>
            } />
            <Route path="/item/create" element={
            //  <ProtectedRoute>
                <CreateItem />
             // </ProtectedRoute>
            } />
            <Route path="/item/edit/:id" element={
            //  <ProtectedRoute>
                <EditItem />
             // </ProtectedRoute>
            } />
            <Route path="/sales" element={
              // <ProtectedRoute>
                <Sales />
              // </ProtectedRoute>
            } />
            <Route path="/sales/create" element={
              // <ProtectedRoute>
                <CreateSales />
              // </ProtectedRoute>
            } />
            <Route path="/sales/edit/:id" element={
              // <ProtectedRoute>
                <EditSales />
              // </ProtectedRoute>
            } />
            <Route path="/purchases" element={
              // <ProtectedRoute>
                <Purchases />
              // </ProtectedRoute>
            } />
            <Route path="/purchases/create" element={
            //  <ProtectedRoute>
                <CreatePurchase />
             // </ProtectedRoute>
            } />
            <Route path="/purchases/edit/:id" element={
            //  <ProtectedRoute>
                <EditPurchase />
             // </ProtectedRoute>
            } />
            <Route path="/contacts" element={
            //  <ProtectedRoute>
                <Contacts />
             // </ProtectedRoute>
            } />
            <Route path="/invoices" element={
            //  <ProtectedRoute>
                <Invoices />
             // </ProtectedRoute>
            } />
            <Route path="/expenses" element={
            //  <ProtectedRoute>
                <Expenses />
             // </ProtectedRoute>
            } />
            <Route path="/reports" element={
            //  <ProtectedRoute>
                <Reports />
             // </ProtectedRoute>
            } />
            <Route path="/settings" element={
            //  <ProtectedRoute>
                <Settings />
             // </ProtectedRoute>
            } />
              <Route path="/" element={
                  //  <ProtectedRoute>
                  <Units />
                  // </ProtectedRoute>
              } />
              <Route path="/units" element={
                  //  <ProtectedRoute>
                  <Units />
                  // </ProtectedRoute>
              } />
              <Route path="/units/create" element={
                  // <ProtectedRoute>
                  <CreateUnits />
                  // </ProtectedRoute>
              } />
              <Route path="/units/edit/:id" element={
                  //  <ProtectedRoute>
                  <EditUnits />
                  // </ProtectedRoute>
              } />
              <Route path="/account-types" element={
                  //  <ProtectedRoute>
                  <AccountType />
                  // </ProtectedRoute>
              } />
              <Route path="/account-type/create" element={
                  //  <ProtectedRoute>
                  <CreateAccountType />
                  // </ProtectedRoute>
              } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
