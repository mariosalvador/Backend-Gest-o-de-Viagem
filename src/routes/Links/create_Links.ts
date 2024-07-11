import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";



export const CreateLink = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/trip/:tripid/links',
        {
            schema: {
                params: z.object({
                    tripid: z.string().uuid()
                }),
                body: z.object({
                    tittle: z.string().min(8),
                    url: z.string().url('Invalid')
                })
            }
        },
        async (request) => {
            const { tittle, url } = request.body;
            const { tripid } = request.params;

            const trip = await prisma.trip.findUnique({
                where: { id: tripid }
            })

            if (!trip)
                throw new Error('Trip Not Found!')

            const link = await prisma.link.create({
                data: {
                    title: tittle,
                    url: url,
                    tripId: tripid
                }
            })


            return { linkId: link.id }
        }
    )
}