import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

//import { env } from "$env/dynamic/private";
// You may want to replace the above with a static private env variable
// for dead-code elimination and build-time type-checking:
//import { OPENAI_API_KEY } from "$env/static/private";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./chat/$types";

interface Prompt {
  role: string;
  content: string;
}

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY || "",
});

export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { messages } = await request.json();

  // Create system level base prompt
  const systemInputs: Prompt[] = [
    {
      role: "system",
      content:
        "You are a chatbot who can only answer questions about LSEG, London Stock Exchange Group or Refinitiv. If you get questions on other topics you should reject them and reply by saying 'I am unable to answer that.'",
    },
  ];

  // Combine the system level inputs with the user inputs
  const prompts: Prompt[] = systemInputs.concat(
    messages.map((message: Prompt) => ({
      content: message.content,
      role: message.role,
    }))
  );

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    //model: "gpt-3.5-turbo",
    model: "ft:gpt-3.5-turbo-1106:personal::8Np92dNV",
    stream: true,
    messages: prompts as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
