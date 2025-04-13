import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { InvoiceProvider } from "./contexts/InvoiceContext";
import Dashboard from "@/pages/Dashboard";
import ViewInvoice from "@/pages/ViewInvoice";
import NotFound from "@/pages/not-found";
import InvoicePreviewPage from "@/pages/InvoicePreviewPage";
import InvoiceHistoryPage from "@/pages/InvoiceHistoryPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/invoice/:id" component={ViewInvoice} />
      <Route path="/preview" component={InvoicePreviewPage} />
      <Route path="/history" component={InvoiceHistoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InvoiceProvider>
        <Router />
        <Toaster />
      </InvoiceProvider>
    </QueryClientProvider>
  );
}

export default App;
