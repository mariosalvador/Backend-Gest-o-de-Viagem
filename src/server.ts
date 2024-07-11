import cors from '@fastify/cors';
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ConfirmParticipants } from "./routes/Trips/confirm_Participants";
import { ConfirmTrip } from "./routes/Trips/confirm_Trip";
import { CreateTrip } from "./routes/Trips/create_Trip";
import { CreateActivity } from './routes/Activities/create_Activity';
import { GetActivity } from './routes/Activities/get_Activity';
import { CreateLink } from './routes/Links/create_Links';
import { GetLinks } from './routes/Links/get_Link';



const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors,{
    origin:'*'
})

app.register(CreateTrip);
app.register(ConfirmTrip);
app.register(ConfirmParticipants)

app.register(CreateActivity)
app.register(GetActivity);

app.register(CreateLink)
app.register(GetLinks)

app.listen({port:3333}).then(()=>{
    console.log("Servidor rodando!")
})