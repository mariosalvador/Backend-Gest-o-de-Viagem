import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/clientError";
import { env } from "../../utils/env_validation";






export const ConfirmParticipants = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get(`/participants/:participantID/confirm`,
        {
            schema: {
                params: z.object({
                    participantID: z.string().uuid(),
                })
            }
        }, async (request,reply) => {
            const {participantID} = request.params;


            const participant = await prisma.participant.findUnique({
                where:{id:participantID},
            })

            const url: string = `${env.WEB_BASE_URL}/trip/${participant?.tripId}`;
            const redirected = reply.redirect(url)

          

            if(!participant)
                throw new ClientError('Participant not found!');
            

            if(participant.is_confirmed)
                return redirected;

            
            await prisma.participant.update({
                where:{id:participantID},
                data:{is_confirmed:true}
            })

            return redirected;
        }
    )
}