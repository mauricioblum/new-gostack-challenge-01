const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateLikes(request, response, next) {
  const { id } = request.params;
  if (request.body.likes) {
    const repo = repositories.find((repo) => repo.id === id);
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

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

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs, likes } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.send(400).json({ error: "Repo not found" });
  }

  let repo = repositories.find((repo) => repo.id === id);

  repo = {
    id: repo.id,
    title: title || repo.title,
    url: url || repo.url,
    techs: techs || repo.techs,
    likes: repo.likes,
  };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.send(400).json({ error: "Repo not found" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.send(400).json({ error: "Repo not found" });
  }

  const repo = repositories.find((repo) => repo.id === id);

  repo.likes += 1;

  repositories[repoIndex] = repo;

  return response.json(repo);
});

module.exports = app;
