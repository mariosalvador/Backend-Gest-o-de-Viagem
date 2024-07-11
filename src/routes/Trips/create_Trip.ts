import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import dayjs from "dayjs";
import nodemailer from 'nodemailer'
import { GetMailClient } from "../../lib/mail";


export const CreateTrip = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/trip', {
        schema: {
            body: z.object(
                {
                    destination: z.string().min(4),
                    start_at: z.coerce.date(),
                    end_at: z.coerce.date(),
                    nameTriper: z.string().min(3),
                    emailTriper: z.string().email('Inválid Email!'),
                    email_ToInvite: z.array(z.string().email())
                }
            )
        }
    }, async (request) => {
        const { destination, start_at, end_at, nameTriper, emailTriper, email_ToInvite } = request.body

        if (dayjs(start_at).isBefore(new Date())) {
            throw new Error('Invalid trip start Date!')
        }

        if (dayjs(end_at).isBefore(start_at)) {
            throw new Error('Invalid trip end Date!')
        }


        const trip = await prisma.trip.create({
            data: {
                destination,
                start_at,
                end_at,
                participants: {
                    createMany: {
                        data: [
                            {
                                name: nameTriper,
                                email: emailTriper,
                                is_confirmed: true,
                                is_owner: true
                            },
                            ...email_ToInvite.map(email => {
                                return { email }
                            })
                        ],
                    }

                }
            }
        })

        const confirmedLink=`http://localhost:3333/trip/${trip.id}/confirm`;

        const formatedStart_Date= dayjs(start_at).format('LL')
        const formatedEnd_Date= dayjs(end_at).format('LL')
        const mail = await GetMailClient()

        const message = await mail.sendMail({
            from: {
                name: 'Explain-Trip',
                address: 'explain@gmail.com'
            },
            to: {
                name: nameTriper,
                address: emailTriper
            },
            subject: `Confirme a sua viagem para ${destination}`,
            html: `
                <div>
                    <p>Você solicitou uma viagm para florianopolis, Brasil nas datas de <strong>${formatedStart_Date}</strong> á <strong>${formatedEnd_Date}</strong></p>

                    <p>Para Confirmar a sua viagem, clique no link abaixo: </p> 
                    
                    <p>
                        <a href=${confirmedLink}>Confirmar Viagem</a>
                    </p>
                </div>
            `.trim()
        })

        console.log('Email: '+nodemailer.getTestMessageUrl(message))
        return { tripId: trip.id }
    })
}