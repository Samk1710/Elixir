import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import ai_prompt from './prompt';
export async function POST(req: Request) {
  const google = createGoogleGenerativeAI({apiKey:'AIzaSyAVQpop5MJZpJg2x3DhEfWs4nCFmOQ-Op0'});
  const { messages } = await req.json();
  
  const result = streamText({
    model: google("models/gemini-2.0-flash"),
    system:ai_prompt,
    messages
    });
  // let llmOutout='';
  // for await (const textPart of result.textStream) {
  //   llmOutout+=textPart;
  // }
  // console.log(llmOutout)
  
  return result.toDataStreamResponse();
}