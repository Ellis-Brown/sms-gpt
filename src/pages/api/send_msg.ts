import { Twilio } from "twilio";

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID ?? "", 
                          process.env.TWILIO_AUTH_TOKEN ?? "");

export default async function sms_handler(request: Request) {

    const message = "Hello"
    // const { body } = request;
    console.log("sms_handler");
    const sms = await client.messages.create({
        body: message,
        from: "+15177818946", // From a valid Twilio number
        to: "+1408202583",
    });
    void sms;
    void request;
    console.log("sms");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    new Response("success");
}