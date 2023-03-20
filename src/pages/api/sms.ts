
// pages/api/sms.js
import type { NextApiRequest, NextApiResponse } from 'next';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Reached this point");
  if (req.method === 'POST') {
    const twiml = new MessagingResponse();

    twiml.message('The Robots are coming! Head for the hills!');

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());
  } else {
    // Return a 405 'Method Not Allowed' error if the request isn't a POST
    res.status(405).send({ error: 'Method Not Allowed' });
  }
}