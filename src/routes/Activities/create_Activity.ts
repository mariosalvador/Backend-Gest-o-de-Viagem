import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import dayjs from "dayjs";
import { ClientError } from "../../errors/clientError";




export const CreateActivity = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post(`/trip/:tripid/activity`,
        {
            schema: {
                params: z.object({
                    tripid: z.string().uuid()
                }),
                body: z.object({
                    title: z.string().min(10),
                    occurs_at: z.coerce.date()

                })
            }
        },
        async (request) => {
            const { title, occurs_at } = request.body;
            const { tripid } = request.params;

            const trip = await prisma.trip.findUnique({
                where: { id: tripid }
            })

            if (!trip) {
                throw new ClientError('Invalid trip!')
            }

            if (dayjs(occurs_at).isBefore(trip.start_at))
                throw new ClientError('Invalid Date!')

            if (dayjs(occurs_at).isAfter(trip.end_at))
                throw new ClientError('Invalid Date!')

            const activity = await prisma.activity.create({
                data: {
                    title,
                    occurs_at,
                    tripId: tripid

                }
            })
            return { activityId: activity.id }
        })
}