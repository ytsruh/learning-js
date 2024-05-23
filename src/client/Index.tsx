import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";

export default function Component() {
  return (
    <>
      <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-gray-100 dark:bg-gray-800">
        <Link className="flex items-center gap-2 font-semibold" to="/">
          <Bot className="text-theme h-6 w-6" />
          <span>ytsruh | AI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/"
          >
            Home
          </Link>
          <Link
            className="hidden text-sm font-medium hover:underline underline-offset-4"
            to="/"
          >
            Login
          </Link>
        </nav>
      </header>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                <span className="text-theme">AI</span> Playground
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                A place to experiment with artificial intelligence, learn about
                different models and the application of them to real world
                problems.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                to="/"
              >
                Coming Soon
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full p-12 bg-gray-100 dark:bg-gray-800">
        <div className="pb-12 text-center">
          <h2 className="text-4xl font-bold">Models</h2>
          <p>A list of models used & experimented with</p>
        </div>
        <div className="grid grid-cols-1 mg:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card>
            <CardHeader>
              <img className="h-10 w-10" src="/static/openai.png" alt="" />
            </CardHeader>
            <CardContent>
              <CardTitle>OpenAI</CardTitle>
              <CardDescription className="py-2">
                Testing the OpenAI API to create bespoke & customised chatbots.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <img className="h-10 w-10" src="/static/ollama.png" alt="" />
            </CardHeader>
            <CardContent>
              <CardTitle>Llama</CardTitle>
              <CardDescription className="py-2">
                Building RAG applications to answer questions based on user
                generated content.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <img className="h-10 w-10" src="/static/mistral.png" alt="" />
            </CardHeader>
            <CardContent>
              <CardTitle>Mistral</CardTitle>
              <CardDescription className="py-2">
                Used to create alternative chatbots & text summarisation.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
      <footer className="py-8">
        <div className="container mx-auto flex justify-around gap-8">
          <div>
            &#169; 2024 -{" "}
            <a href="https://www.ytsruh.com" className="text-theme">
              ytsruh
            </a>
          </div>
          <div>
            <Link className="text-sm font-medium hover:underline" to="/">
              Home
            </Link>
            <Link className="hidden text-sm font-medium hover:underline" to="#">
              About
            </Link>
            <Link className="hidden text-sm font-medium hover:underline" to="#">
              Apps
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
