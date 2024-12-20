import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/clientError";



export const GetLinks = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get(`/trip/:tripid/links`,
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
                    links: true
                }
            })

            if (!trip) {
                throw new ClientError('Invalid trip!')
            }



            return { linksId: trip.links }
        })
}
