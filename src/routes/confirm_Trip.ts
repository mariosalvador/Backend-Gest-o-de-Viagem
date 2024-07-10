import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";



export const ConfirmTrip = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get('/trip/:tripid/confirm', {
        schema: {
            params:z.object({
                tripid:z.string().uuid()
            })
        }
    }, async (request) => {

        return { tripId: request.params.tripid }
    })
}