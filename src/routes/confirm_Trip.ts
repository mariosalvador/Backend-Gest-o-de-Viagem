import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import z from "zod";
import { GetMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";


export const ConfirmTrip = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get('/trip/:tripid/confirm', {
        schema: {
            params: z.object({
                tripid: z.string().uuid()
            })
        }
    },
        async (request, reply) => {
            const { tripid } = request.params;
            const url: string = `http://localhost:3000/trip/${tripid}`;
            const redirected = reply.redirect(url)

            const trip = await prisma.trip.findUnique({
                where: {
                    id: tripid
                },
                include: {
                    participants: {
                        where: {
                            is_owner: false
                        }
                    }
                }
            })

            if (!trip) {
                throw new Error('Trip not found!')
            }


            if (trip.is_confirmed) {
                return redirected
            }

            await prisma.trip.update({
                where: { id: tripid },
                data: { is_confirmed: true }
            })




            const formatedStart_Date = dayjs(trip.start_at).format('LL')
            const formatedEnd_Date = dayjs(trip.end_at).format('LL')

            const mail = await GetMailClient()

            await Promise.all(
                trip.participants.map(async (participant) => {

                    const confirmedLink = `http://localhost:3333/participants/${participant.id}/confirm`;

                    const message = await mail.sendMail({
                        from: {
                            name: 'Explain-Trip',
                            address: 'explain@gmail.com'
                        },
                        to: participant.email,
                        subject: `Confirme a sua presença na viagem para ${trip.destination} em ${formatedStart_Date}`,
                        html: `
                            <div>
                                <p>Você foi convidado a participar da viagem para <strong>${trip.destination}</strong> á <strong>${formatedStart_Date}</strong></p>
            
                                <p>Para Confirmar a sua viagem, clique no link abaixo: </p> 
                                
                                <p>
                                    <a href=${confirmedLink}>Confirmar Viagem</a>
                                </p>
                            </div>
                        `.trim()
                    })

                    console.log('Email: '+nodemailer.getTestMessageUrl(message))
                })
            )

            return redirected;
        })
}