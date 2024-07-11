import cors from '@fastify/cors';
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ConfirmParticipants } from "./routes/confirm_Participants";
import { ConfirmTrip } from "./routes/confirm_Trip";
import { CreateTrip } from "./routes/create_Trip";
import { CreateActivity } from './routes/create_Activity';
import { GetActivity } from './routes/get_Activity';



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

app.listen({port:3333}).then(()=>{
    console.log("Servidor rodando!")
})