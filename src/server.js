const express = require('express');

const app = express();

app.get("/message/:id/:user", (request, response) => {
    const {id, user} = request.params
    response.send(`
    Mensagem ID: ${id} .
    Para o usuario: ${user}`)
})

app.get("/users", (request, response) =>{
    const {page, limit} = request.query
    response.send(`Page: ${page} View: ${limit}`)
})

app.post("/user", (request, response) => {
    const {name, email, passworld} = request.body

    response.send(`Nome: ${name} --- Email: ${email} --- Passworld: ${passworld}`)
})

const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));