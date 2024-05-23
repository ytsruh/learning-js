import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "@/client/NotFound";
import Index from "@/client/Index";
import Hello from "@/client/Hello";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/hello/:name" element={<Hello />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
