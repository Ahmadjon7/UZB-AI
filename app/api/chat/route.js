import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

export const maxDuration = 30

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

