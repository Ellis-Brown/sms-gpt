/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Twilio } from "twilio";
import { getServerSession } from "next-auth/next";
import authOptions from "./auth/[...nextauth]"
import type { NextApiRequest, NextApiResponse } from "next";

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID ?? "", 
                          process.env.TWILIO_AUTH_TOKEN ?? "");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
  ) {
    // Check if user is logged in
    // const session = await getServerSession(req, res, authOptions);
    // if (!session || !session.user) {
    //   return res.status(500).json("Login to upload.");
    // }
  

    const message = "Hello"
    const { to } = req.body;
    console.log(to);
    console.log("sms_handler");
    const sms = await client.messages.create({
        body: message,
        from: "+15177818946", // From a valid Twilio number
        to: to,
    });
    void sms;
    res.status(200).send("OK");
}

