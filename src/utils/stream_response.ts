/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { OpenAIStreamPayload } from './OpenAIStreamPayload';
import  { OpenAIStream } from './OpenAIStreamPayload';
const max_msg_size = 20;
// Import Twilio client
import { Twilio } from 'twilio';

// Set up Twilio client
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID ?? "", 
                          process.env.TWILIO_AUTH_TOKEN ?? "");
                          
export default async function consumeOpenAIStream(payload: OpenAIStreamPayload, To: string, From: string) {
  const stream = await OpenAIStream(payload);

  let message = '';
  const reader = stream.getReader();
  const decoder = new TextDecoder();


  while (true) {
    console.log("Reading stream...")
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    message += chunk;

    // Send a text message every max_msg_size characters
    if (message.length >= max_msg_size) {
      const sms = await client.messages.create({
        body: message,
        from: From,
        to: To,
      });
      console.log(`Sent SMS: ${sms.sid}`);
      message = "";
    }
  }
  if (message.length > 0) {
    const sms = await client.messages.create({
      body: message,
      from: From,
      to: To,
    });
    console.log(`Sent SMS: ${sms.sid}`);
  }
}
