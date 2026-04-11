import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import UploadPage from "./pages/UploadPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import NotFoundPage from "./pages/NotFoundPage";

if (!window.location.hash) {
  window.location.hash = "#/";
}

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={UploadPage} />
        <Route path="/result/:id" component={ResultPage} />
        <Route path="/history" component={HistoryPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}
