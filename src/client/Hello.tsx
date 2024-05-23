import { useParams } from "react-router-dom";

export default function Hello() {
  const { name } = useParams();

  return (
    <h1 className="h-screen flex items-center justify-center text-red-800 text-3xl">
      Hello {name}!
    </h1>
  );
}
