import { useState } from "react";
import { Button } from "@/client/components/ui/button";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8 flex flex-col items-center justify-center h-screen">
      <h1 className="text-theme text-4xl">Hello World</h1>
      <p>Current Count: {count}</p>
      <div>
        <button onClick={() => setCount((prev) => prev + 1)}>Click Me!</button>
      </div>
      <div className="w-1/2 py-5">
        <AlertDemo />
      </div>
      <Button>Button</Button>
    </div>
  );
}

import { Terminal } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/client/components/ui/alert";

function AlertDemo() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  );
}
