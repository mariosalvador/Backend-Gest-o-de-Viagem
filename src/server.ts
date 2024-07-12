import cors from '@fastify/cors';
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ConfirmParticipants } from "./routes/Participants/confirm_Participants";
import { ConfirmTrip } from "./routes/Trips/confirm_Trip";
import { CreateTrip } from "./routes/Trips/create_Trip";
import { CreateActivity } from './routes/Activities/create_Activity';
import { GetActivity } from './routes/Activities/get_Activity';
import { CreateLink } from './routes/Links/create_Links';
import { GetLinks } from './routes/Links/get_Link';
import { GetParticipants } from './routes/Participants/get_Participants';
import { CreateInvite } from './routes/Invite/create_Invite';
import { UpdateTrip } from './routes/Trips/update_Trip';
import { GetTripDetails } from './routes/Trips/get_TripDetails';
import { GetOnlyOneParticipant } from './routes/Participants/get_OnlyOneParticipant';
import { errorHandler } from './errors/errors';
import { env } from './utils/env_validation';




const app = fastify();

app.setErrorHandler(errorHandler);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
    origin: '*'
})

app.register(CreateTrip);
app.register(ConfirmTrip);
app.register(UpdateTrip)
app.register(GetTripDetails)

app.register(ConfirmParticipants)
app.register(GetParticipants)
app.register(GetOnlyOneParticipant)

app.register(CreateActivity)
app.register(GetActivity);

app.register(CreateLink)
app.register(GetLinks)

app.register(CreateInvite)

app.listen({ port: env.PORT}).then(() => {
    console.log("Servidor rodando!")
})