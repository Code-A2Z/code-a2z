import {Resend} from "resend";

const resend = new Resend('ADD YOUR API KEY');

export const sendEmail = async (to : string | Array<string>, subject : string, html : string) => {
    try {
        const data = await resend.emails.send({
            from: 'XXXXXXXXXXXXXXXXXXXXX',
            to ,
            subject,
            html,
        });

        return data;
    } catch (error) {
        console.error("facing an error while sending email : " ,error);
    }
}