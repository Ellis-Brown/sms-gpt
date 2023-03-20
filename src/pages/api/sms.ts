/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// pages/api/sms.js
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';

export default function handler(req: NextApiRequest , res: NextApiResponse) {
  console.log("Reached this point");
  if (req.method === 'POST') {
    const twiml = new MessagingResponse();
    twiml.message(JSON.stringify(req.body).toString());

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());
  } else {
    // Return a 405 'Method Not Allowed' error if the request isn't a POST
    res.status(405).send({ error: 'Method Not Allowed' });
  }
}

async function queryOpenAi() {

  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }));

  const completion = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    prompt: "Hello world",
  });
  if (!completion || !completion.data || !completion.data.choices || !completion.data.choices[0]) {
    return "Error: No data in response"
  }
  return completion.data.choices[0].text
}