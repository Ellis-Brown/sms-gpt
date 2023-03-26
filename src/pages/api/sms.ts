/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// pages/api/sms.js
import type { NextApiRequest, NextApiResponse } from 'next';
import type { OpenAIStreamPayload } from '../../utils/OpenAIStreamPayload';

import consumeOpenAIStream from '../../utils/stream_response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // const twiml = new MessagingResponse();
    const user_message: string = req.body.Body;
    const { To, From }: { To: string, From: string } = req.body;
    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: user_message }],
      max_tokens: 1000,
      stream: true,
    }
    await consumeOpenAIStream(payload, To, From);
    res.status(200).send("OK");
  } else {
    // Return a 405 'Method Not Allowed' error if the request isn't a POST
    res.status(405).send({ error: 'Method Not Allowed' });
  }
}
