import cors from '@fastify/cors';
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ConfirmParticipants } from "./routes/confirm_Participants";
import { ConfirmTrip } from "./routes/confirm_Trip";
import { CreateTrip } from "./routes/create_Trip";



const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors,{
    origin:'*'
})

app.register(CreateTrip);
app.register(ConfirmTrip);
app.register(ConfirmParticipants)

app.listen({port:3333}).then(()=>{
    console.log("Servidor rodando!")
})