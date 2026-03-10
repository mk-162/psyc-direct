import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import KnowledgeHub from "@/pages/knowledge-hub";
import ArticlePage from "@/pages/article";
import ExpertWitness from "@/pages/expert-witness";
import ComponentLibrary from "@/pages/component-library";
import PrivacyPolicy from "@/pages/privacy-policy";
import Terms from "@/pages/terms";
import Blog from "@/pages/blog";
import BlogCategory from "@/pages/blog-category";
import BlogArticle from "@/pages/blog-article";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/expert-witness" component={ExpertWitness} />
      <Route path="/knowledge-hub" component={KnowledgeHub} />
      <Route path="/knowledge-hub/:slug" component={ArticlePage} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/category/:slug" component={BlogCategory} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/component-library" component={ComponentLibrary} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
