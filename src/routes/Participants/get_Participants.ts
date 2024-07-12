import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/clientError";





export const GetParticipants = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get(`/trip/:tripid/participants`,
        {
            schema: {
                params: z.object({
                    tripid: z.string().uuid()
                }),
            }
        },
        async (request) => {
            const { tripid } = request.params;

            const trip = await prisma.trip.findUnique({
                where: { id: tripid },
                include: {
                    participants: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            is_confirmed: true
                        }
                    }
                }
            })

            if (!trip) {
                throw new ClientError('Invalid trip!')
            }



            return { parcipants: trip.participants }
        })
}
