import nodemailer from 'nodemailer';


export const GetMailClient=async()=>{
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host:'smtp.ethereal.email',
        port:666,
        secure:false,
        auth:{
            user:account.user,
            pass:account.pass
        }
    })

    return transporter;
}
