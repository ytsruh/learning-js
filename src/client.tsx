import { createRoot } from "react-dom/client";
import RouteSwitch from "@/client/RouteSwitch";

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<RouteSwitch />);
