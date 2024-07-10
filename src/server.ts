import fastify from "fastify";

const app = fastify();

app.get('/teste', ()=>{
    return "Hello world! com Get()"
})

app.listen({port:3333}).then(()=>{
    console.log("Servidor rodando!")
})