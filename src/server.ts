import fastify from "fastify";
import { CreateTrip } from "./routes/create_Trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ConfirmTrip } from "./routes/confirm_Trip";
import cors from '@fastify/cors';
const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors,{
    origin:'*'
})

app.register(CreateTrip);
app.register(ConfirmTrip)

app.listen({port:3333}).then(()=>{
    console.log("Servidor rodando!")
})
  
  