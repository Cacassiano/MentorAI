require("dotenv").config({
    path:".env"
})

const express = require("express");
const app = express();
const cors = require("cors");
const { Type } = require("@google/genai");
const port = 8080;
const GoogleGenAI = require("@google/genai").GoogleGenAI;
const ia = new GoogleGenAI({apiKey: process.env.API_KEY})

app.use(express.json())
app.use(cors());

app.listen(port, () => {
    console.log("ouvindo na porta: "+port);
})

// Tema:
// pessoas que querem passar em concursos e não sabem como começar estudar e se prepara e talss

app.get("/", async (req, resp) => {
    const response = await ia.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "pense que vocÊ é um analista de dados e para ajudar os alunos do ensino medio a escolherem para focar no ENEM voce deve fazer o seguinte: Para cada uma das seguintes matérias da prova do ENEM: História, Geografia, Filosofia, Sociologia, Química, Física, Biologia, Língua Portuguesa, Literatura, Língua Estrangeira (Inglês ou Espanhol), Artes, Educação Física e Tecnologias da Informação e Comunicação, liste os 10 conteúdos ou habilidades mais relevantes de se ter e cobradas pela prova e Ao lado de cada conteúdo, inclua a média de questões que costumam aparecer sobre ele em uma prova do ENEM, arredondando os números para o inteiro positivo mais próximo",
        config:{
            responseMimeType: "application/json",
            responseSchema:{
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        nome: {type: Type.STRING},
                        conteudos: {
                            type: Type.ARRAY,
                            items:{
                                type:Type.OBJECT,
                                properties:{
                                    nome:{type: Type.STRING},
                                    media: {type: Type.NUMBER }
                                }
                            }  
                        },
                    }
                }
            }
        }
    })
    console.log(response.text)
    resp.send(response.text)
})
