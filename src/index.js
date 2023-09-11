require("dotenv").config({ path: ".env" })
const fastJson = require('fast-json-stringify')
const { randomUUID } = require("crypto");
const fastify = require("fastify")()
const cache = require("./configs/Cache")
const clientDB = require("./configs/Database");

const stringifyPeople = fastJson({
    "type": "object",
    "properties": {
        "apelido": {
            "type": "string"
        },
        "nome": {
            "type": "string"
        },
        "id": {
            "type": "string"
        },
        "stack": {
            "type": ["string", "null"]
        },
        "nascimento": {
            "type": "string"
        }
    },
})

const stringifyPeoples = fastJson({
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "apelido": {
                "type": "string"
            },
            "nome": {
                "type": "string"
            },
            "id": {
                "type": "string"
            },
            "stack": {
                "type": ["string", "null"]
            },
            "nascimento": {
                "type": "string"
            }
        },
    }
})

fastify.get("/pessoas/:id", async (req, res) => {
    const peopleCached = await cache.get(req.params.id);
    if (peopleCached) {
        return res.send(peopleCached)
    }
    const people = await clientDB("peoples_with_index")
        .where("id", req.params.id)
        .limit(1);

    if (people.length == 0) {
        return res.code(404).send({ messge: "Not found" })
    }

    await cache.set(req.params.id, stringifyPeople(people[0]), 'EX', 2)
    return res.send(people[0]);

})

fastify.get("/pessoas", async (req, res) => {
    const term = req.query.t;
    const page = req.query.page || 10;
    const itemsPerPage = req.query.itemsPerPage || 10;
    const keyCached = `${term}${page}${itemsPerPage}`
    if (!term) {
        return res.code(400).send({
            message: "The field term is required"
        })
    }

    const peopleCached = await cache.get(keyCached)
    if (peopleCached) {
        return res.code(200).send(peopleCached)
    }


    const registers = await clientDB("peoples_with_index")
                                .whereRaw("search ilike ?", [`%${term}%`])
                                .offset((page - 1) * itemsPerPage)
                                .limit(itemsPerPage);

    await cache.set(keyCached, stringifyPeoples(registers), 'EX', 3)
    return res.code(200).send(registers);
})

fastify.post("/pessoas", async (req, res) => {
    const data = req.body;
    if (!data.apelido) {
        return res.code(400).send({ message: "The field apelido is required" })
    } else if (data.apelido && data.apelido.length > 32) {
        return res.code(400).send({ message: "The field apelido can't have more than 32 characters" })
    }

    if (!data.nome) {
        return res.code(400).send({ message: "The field nome is required" })
    } else if (data.nome && data.nome.length > 100) {
        return res.code(400).send({ message: "The field nome can't have more than 32 characters" })
    }

    if (!data.nascimento) {
        return res.code(400).send({ message: "The field nascimento is required" })
    } else if (data.nascimento && !/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/.test(data.nascimento)) {
        return res.code(400).send({ message: "The field nascimento needs informed in this format YYY-MM-DD" })
    }

    if (data.stack) {
        const hasItemInvalid = data.stack.find(item => item.length > 32);
        if (hasItemInvalid) {
            return res.code(400).send({ message: "The field stack item can't have more than 32 characteres" })

        }
    }

    const peopleWithApelido = await clientDB("peoples_with_index")
        .where("apelido", data.apelido)
        .limit(1)
        .then(item => item[0])

    // if (peopleWithApelido) {
    //     return res.code(422).send({
    //         message: "Nickname can't use again"
    //     })
    // }    

    data.id = randomUUID();
    if (data.stack.length > 0) data.stack = JSON.stringify(data.stack)
    data.search = `${data.nome} ${data.apelido} ${data.stack}`
    await clientDB("peoples").insert(data)
    return res.code(201).send({})
})

fastify.get("/contagem-pessoas", async (req, res) => {
    const total = await clientDB("total_peoples").select(["total"]).limit(1)
    return res.send({ total: total[0].total })
})


async function server() {
    await fastify.listen({ port: 80, host: '0.0.0.0' })
    console.log("Server is running")
}

server()