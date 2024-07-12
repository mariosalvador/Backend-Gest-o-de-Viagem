import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import dayjs from "dayjs";
import { ClientError } from "../../errors/clientError";


export const UpdateTrip = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().put('/trip/:tripid', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object(
                {
                    destination: z.string().min(4),
                    start_at: z.coerce.date(),
                    end_at: z.coerce.date(),
                }
            )
        }
    }, async (request) => {
        const { destination, start_at, end_at } = request.body
        const { tripId } = request.params

        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
        })

        if (!trip)
            throw new ClientError('Trip Not Found!')


        if (dayjs(start_at).isBefore(new Date()))
            throw new ClientError('Invalid trip start Date!')


        if (dayjs(end_at).isBefore(start_at))
            throw new ClientError('Invalid trip end Date!')

       
        await prisma.trip.update({
            where: { id: tripId },
            data: {
                destination,
                start_at,
                end_at
            }
        })


        return { tripId: trip.id }
    })
}