require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3000;

// Configurações
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do Gemini
const genAI = new GoogleGenAI({apiKey: process.env.API_KEY});

// Rota principal
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para processar o formulário
app.post('/generate-plan', async (req, res) => {
  try {
    const {
      studyTime, 
      selfLearningHistory,
      learningStyle,
      difficulties,
      affinities,
      bestTime,
      targetScore,
      methodologyDifficulties
    } = req.body;

    const prompt = `
Você é um psicopedagogo especializado em estratégias de estudo e seu objetivo é desenvolver planos de estudo eficientes, flexíveis e escaláveis para um estudante do {3º ano do ensino médio} de {escola pública} que se prepara para o {ENEM 2025}.

Este estudante possui apenas ${studyTime} diárias para estudo 

${selfLearningHistory}, o que exige alta adesão, progressividade e foco em rotina gradual. 

O estudante aprende melhor ${learningStyle}, 

tem dificuldade em ${difficulties}, 

possui afinidade em ${affinities}, 

estuda melhor pela ${bestTime}, 

busca atingir nota ${targetScore}.

tem alguma dificuldade com alguma metodologia: ${methodologyDifficulties}

Sua tarefa é criar 3 planos de estudo distintos, detalhados e claros, que respeitem esse perfil e contemplem os seguintes pontos:

1. Explicação inicial

Apresente uma explicação didática sobre o método selecionado, enfatizando:

Vantagens

Desvantagens

Como funciona

Explique de forma simples o Ciclo de Estudos e a lógica de progressão (aumentando carga gradualmente).

2. Para cada plano de estudo

Nome do Plano e Metodologia: Dê um nome motivador e descreva o tipo de abordagem (ex: Ciclo de Estudos, Horários Programados).

Tempo de Duração Esperado: Defina o período em semanas em que o plano deve ser seguido antes da evolução.

Foco Principal: Exemplo: "mais prática com exercícios" ou "equilíbrio entre teoria e treino".

Estratégias de Eficiência e Produtividade: Liste 2–3 maneiras práticas de otimizar tempo e manter foco (ex: revisão imediata de erros, bloco menor no início, alternância de matérias difíceis e fáceis).

Sugestão de Horários:

Dividir as ${studyTime} diárias em blocos curtos (começando com 40 min + 5 min pausa, evoluindo depois para 50/10).

Indicar pausas estratégicas.

Divisão de Matérias e Conteúdos (Exemplo de Ciclo/Rotina):

Listar disciplinas e temas de cada bloco.

Colocar mais prática (70%) que teoria (30%) nos blocos, especialmente em Matemática, Ciências da Natureza e Redação.

Explicar que cada bloco deve ser concluído antes de avançar, independentemente do dia da semana.

Dicas de Motivação e Foco:

Estratégias práticas como técnica Pomodoro, registro de erros em caderno, metas semanais pequenas e revisão imediata ao fim de cada bloco.

3. Bibliografia e Leituras Essenciais

Liste autores e obras literárias mais cobradas no ENEM.

Dê dicas práticas de como abordá-las (ex: resumos, questões comentadas, mapas mentais).

Inclua também materiais digitais gratuitos (playlists no YouTube, bancos de questões, plataformas de simulado).

4. Contexto do Estudante

Prova: ENEM 2025

Estilo do plano: adaptado ao perfil (mais prático, menos teórico, com foco em exercícios e progressão gradual)

Nível: iniciante, sem hábito de estudo diário

Tempo livre: ${studyTime}/dia

Matérias com dificuldade: ${difficulties}

Afinidades: ${affinities}

Melhor horário de estudo: ${bestTime}

Objetivo: atingir nota ${targetScore}

5. Instruções adicionais

Só crie o plano após receber as respostas.

Pesquise conteúdos, vídeos, playlists e exercícios práticos na internet para complementar.

Baseie-se em provas anteriores do ENEM para indicar exercícios inteligentes.

Evite instruções vagas como "estude matemática"; sempre detalhe conteúdos e habilidades específicas.

Estruture a progressão em fases (exemplo: semanas 1–4 = blocos menores, semanas 5–8 = redações quinzenais, semanas 9+ = simulados semanais).

Para cada plano, ao final, crie uma tabela estilo Google Planilhas, estruturando:

Bloco de estudo

Conteúdos essencial de todas as disciplinas que serão estudadas e cobradas para a prova  

Tipo de atividade (teoria ou prática)

Sugestões do que fazer em cada sessão
`;

    // Modelo Gemini
    const result = await genAI.models.generateContent({
        model: "gemini-2.5-pro",
        contents:prompt
    });
    const response = result.text;

    res.render('result', { studyPlan: response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Ocorreu um erro ao gerar o plano de estudos.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;