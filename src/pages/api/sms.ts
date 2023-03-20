/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// pages/api/sms.js
import type { NextApiRequest, NextApiResponse} from 'next';
import { Configuration, OpenAIApi } from 'openai';
import type { CreateChatCompletionResponseChoicesInner } from 'openai';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';

export default async function handler(req: NextApiRequest , res: NextApiResponse) {
  if (req.method === 'POST') {
    const twiml = new MessagingResponse();
    const user_message: string = req.body.Body;
    console.log("Querying OpenAI with: " + user_message);
    const chatbot_response = await queryOpenAi(user_message);
    console.log("Chatbot response: ", chatbot_response);
    if (chatbot_response == undefined) {
      res.status(500).send({ error: 'Error: No data in response' });
    } 
    else {
      console.log("Chatbot response: ", chatbot_response)
      twiml.message(chatbot_response);
    }
    res.setHeader('Content-Type', 'text/xml');
    console.log("Sending text message")
    // res.status(200).type('text/xml').send(twiml.toString());
    res.status(200).send(twiml.toString());
  } else {
    // Return a 405 'Method Not Allowed' error if the request isn't a POST
    res.status(405).send({ error: 'Method Not Allowed' });
  }
}

async function queryOpenAi(user_message: string) {

  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }));

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: user_message}],
  });
  if (!completion || !completion.data || !completion.data.choices || !completion.data.choices[0]) {
    return "Error: No data in response"
  }
  const temp: CreateChatCompletionResponseChoicesInner = completion.data.choices[0];
  return temp.message?.content;
}