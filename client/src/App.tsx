import { Route, Switch } from "wouter";
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
    <Switch hook={useHashLocation}>
      <Route path="/" component={UploadPage} />
      <Route path="/result/:id" component={ResultPage} />
      <Route path="/history" component={HistoryPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
