import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/clientError";



export const GetTripDetails = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get(`/trip/:tripid`,
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
                select: {
                    id: true,
                    destination: true,
                    start_at: true,
                    end_at: true,
                    is_confirmed: true
                },
                where: { id: tripid }
            })

            if (!trip) {
                throw new ClientError('Invalid trip!')
            }



            return { trip }
        })
}
