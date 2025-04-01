import type { Route } from "./+types/home";
import { OpenAI } from "openai";
import fs from "fs";
import { Form, useFetcher } from "react-router";
import { useState, useEffect, useRef } from "react";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export function meta({}: Route.MetaArgs) {
  return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export function loader({}: Route.LoaderArgs) {
  return { message: "Hello World" };
}

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  let message = formData.get("message");
  if (!message) {
    return { message: "Missing message" };
  }

  try {
    const file = await client.files.create({
      file: fs.createReadStream("./public/guidelines.pdf"),
      purpose: "user_data",
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "You are a brand specialist for American Express. You have been provided the global guidelines and your job is to advise users on what is or is not brand compliant. You should only respond with answers about brand, design, colors, photography etc. Your job is to give short, concise answers about the brand guidelines.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "file",
              file: {
                file_id: file.id,
              },
            },
            {
              type: "text",
              text: message as string,
            },
          ],
        },
      ],
    });
    return { message: completion.choices[0].message.content };
  } catch (error) {
    console.error(error);
    return { message: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}

type Message = {
  content: string;
  type: "user" | "ai";
};

export default function Home({}: Route.ComponentProps) {
  const fetcher = useFetcher();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (fetcher.data?.message && fetcher.state === "idle") {
      setMessages((prev) => [...prev, { content: fetcher.data.message, type: "ai" }]);
    }
  }, [fetcher.data, fetcher.state]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;
    if (message.trim()) {
      setMessages((prev) => [...prev, { content: message, type: "user" }]);
    }
  };

  return (
    <div className="min-h-screen max-h-screen flex flex-col justify-between">
      <Nav />
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg max-w-full ${
              message.type === "user" ? "chat chat-start" : "chat chat-end"
            }`}>
            <div
              className={`chat-bubble ${
                message.type === "user" ? "chat-bubble chat-bubble-neutral" : "chat-bubble chat-bubble-info"
              }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <fetcher.Form
        method="post"
        className="flex items-center justify-center gap-2 w-full p-5"
        autoComplete="off"
        onSubmit={handleSubmit}>
        <label className="floating-label w-full">
          <span>Message</span>
          <input type="text" name="message" className="input input-md w-full" />
        </label>
        {fetcher.state === "submitting" ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <button type="submit" className="btn">
            Submit
          </button>
        )}
      </fetcher.Form>
    </div>
  );
}

function Nav() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <p className="btn btn-ghost text-xl hidden md:inline">Brand Guideline Checker</p>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/public/guidelines.pdf" target="_blank">
              Guidelines
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
