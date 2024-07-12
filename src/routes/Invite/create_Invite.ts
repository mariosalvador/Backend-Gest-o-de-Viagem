import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import dayjs from "dayjs";
import { GetMailClient } from "../../lib/mail";
import nodemailer from "nodemailer";
import { ClientError } from "../../errors/clientError";
import { env } from "../../utils/env_validation";




export const CreateInvite = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/trip/:tripid/invite',
        {
            schema: {
                params: z.object({
                    tripid: z.string().uuid()
                }),
                body: z.object({
                    email: z.string().email()
                })
            }
        },
        async (request) => {
            const { email } = request.body;
            const { tripid } = request.params;

            const trip = await prisma.trip.findUnique({
                where: { id: tripid }
            })

            if (!trip)
                throw new ClientError('Trip Not Found!')

            const participant = await prisma.participant.create({
                data: {
                    email,
                    tripId: tripid
                }
            })

            const formatedStart_Date = dayjs(trip.start_at).format('LL')
            const formatedEnd_Date = dayjs(trip.end_at).format('LL')

            const mail = await GetMailClient()

            const confirmedLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

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

            console.log('Email: ' + nodemailer.getTestMessageUrl(message))


            return { participant: participant.id }
        }
    )
}