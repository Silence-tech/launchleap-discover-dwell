import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Submit } from "@/pages/Submit";
import { Discover } from "@/pages/Discover";
import { ToolDetail } from "@/pages/ToolDetail";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { Auth } from "@/pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="producshine-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={
                <Layout>
                  <Home />
                </Layout>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="/submit" element={
                <AuthGuard>
                  <Layout>
                    <Submit />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/discover" element={
                <Layout>
                  <Discover />
                </Layout>
              } />
              <Route path="/trending" element={
                <Layout>
                  <Discover />
                </Layout>
              } />
              <Route path="/tool/:id" element={
                <Layout>
                  <ToolDetail />
                </Layout>
              } />
              <Route path="/profile" element={
                <AuthGuard>
                  <Layout>
                    <Profile />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/settings" element={
                <AuthGuard>
                  <Layout>
                    <Settings />
                  </Layout>
                </AuthGuard>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
