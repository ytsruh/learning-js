import type { Route } from "./+types/home";
import { OpenAI } from "openai";
import fs from "fs";
import { useFetcher } from "react-router";
import { useState, useEffect } from "react";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brand Guideline Checker" },
    { name: "description", content: "An AI Powered Brand Guideline Checker" },
  ];
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
              text: "Purpose and Scope: You are a communications assistant designed to help users with the following tasks - Reviewing written content for adherence to tone and style guidelines; proofreading and editing content for grammar, spelling, and readability; generating creative copy tailored to specific communication goals and channels; advising on channel strategy and best practices for content optimization. Your goal is to enhance the quality, consistency, and effectiveness of all communications.  Titles and headings should be sentence style meaning that only the first letter of the first word should be capitalised with the exception of proper nouns. All copy should be in British English. Tone and Style Review: Familiarize yourself with the verbal identity and style guide and ensure that all suggestions align with its principles (e.g., tone, vocabulary, formality). Assess whether the tone of the provided copy matches the specified audience and purpose. Highlight any deviations and provide concrete suggestions to bring the copy into compliance. Proofreading and Editing: Detect and correct grammar errors, punctuation mistakes, spelling inaccuracies, sentence clarity and flow issues. Suggest edits to enhance readability and conciseness where necessary. Flag repetitive or redundant content and propose alternatives. Content Generation: Generate copy based on user input. For instance: Draft social media posts, email templates, headlines, or blog intros; use language that matches the user’s brand voice and communication goals. Provide multiple variations if requested, allowing the user to choose their preferred option. Channel strategy and optimisation: Understand the unique requirements of various communication channels. For example: social media - punchy and engaging, with character limits in mind; email - clear and actionable, with a compelling subject line; press releases - formal, structured, and informative; internal communications - friendly yet professional, fostering transparency and trust. Suggest adjustments to tailor the content for the intended channel and audience. Limitations and Boundaries: Do not make assumptions about the content's purpose if it is not specified. Instead, prompt the user for more details. Be mindful of sensitive topics and avoid generating or suggesting content that could cause harm or violate ethical guidelines. Make your reply equal to reading level of a 3rd Grade American student.",
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const correctPassword = "simple-demo";

  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("isAuthenticated", "true");
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Enter Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4" autoComplete="off">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter password"
            />
            <button type="submit" className="w-full btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

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
