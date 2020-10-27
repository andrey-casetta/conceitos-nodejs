const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository id." });
  }

  return next();
}

/**
 * GET /repositories: Rota que lista todos os repositórios;
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * GET /repositories: Rota que lista repositório especifico de acordo com id
 */
app.get("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repo = repositories.find((repo) => repo.id === id);

  if (!repo) {
    return response.status(400).json({ error: "Repository not found!!!" });
  }

  return response.json(repo);
});

/**
 * POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição,
 * sendo a URL o link para o github desse repositório. A
 * o cadastrar um novo projeto,
 * ele deve ser armazenado dentro de um objeto no
 * seguinte formato:
 * {
 * id: "uuid",
 * title: 'Desafio Node.js',
 * url: 'http://github.com/...',
 * techs: ["Node.js", "..."], l
 * likes: 0
 * };
 * Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repo);
  return response.json(repo);
});

/**
 * PUT /repositories/:id:
 * A rota deve alterar apenas o title, a url e as techs do repositório que possua o
 * id igual ao id presente nos parâmetros da rota;
 */
app.put("/repositories/:id", verifyId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repos) => repos.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }
  const repo = {
    title,
    url,
    techs,
  };

  repositories[repoIndex].title = repo.title;
  repositories[repoIndex].url = repo.url;
  repositories[repoIndex].techs = repo.techs;

  return response.json(repositories[repoIndex]);
});

/**
 * DELETE /repositories/:id :
 * A rota deve deletar o repositório com o id presente nos parâmetros da rota;
 */
app.delete("/repositories/:id", verifyId, (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repos) => repos.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  repositories.splice(repoIndex);

  return response.status(204).send();
});

/**
 * POST /repositories/:id/like:
 * A rota deve aumentar o número de likes do repositório específico escolhido através do
 * id presente nos parâmetros da rota, a cada chamada dessa rota,
 * o número de likes deve ser aumentado em 1;
 */

app.post("/repositories/:id/like", verifyId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }
  const repo = repositories[repoIndex];
  repo.likes += 1;
  repositories[repoIndex] = repo;
  return response.json(repo);
});

module.exports = app;
