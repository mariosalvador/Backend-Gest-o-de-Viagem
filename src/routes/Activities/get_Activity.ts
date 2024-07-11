import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import dayjs from "dayjs";





export const GetActivity = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get(`/trip/:tripid/activity`,
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
                    activities: {
                        orderBy: {
                            occurs_at: "asc"
                        }
                    }
                }
            })

            if (!trip) {
                throw new Error('Invalid trip!')
            }

            const differenceBetweenTripStartAndEnd = dayjs(trip.end_at).diff(trip.start_at, 'days')
            const activitiesDays = Array.from({ length: differenceBetweenTripStartAndEnd }).map(
                (element, index) => {
                    const date = dayjs(trip.start_at).add(index, 'days');

                    return {
                        day: date.toDate(),
                        activities: trip.activities.filter(activities => {
                            return dayjs(activities.occurs_at).isSame(date, 'day')
                        }
                        )
                    }
                }
            )

            return { activitiesDays }
        })
}
