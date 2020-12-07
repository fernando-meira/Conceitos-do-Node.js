const express = require("express")
const cors = require("cors")

const { v4: uuid, validate: isUuid } = require("uuid")

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
})

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    url,
    title,
    techs,
    likes: 0,
    id: uuid(),
  }

  repositories.push(repository)

  return response.status(201).json(repository)
})

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { url, title, techs } = request.body

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  )

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "Repository not found." })
  }

  const repository = repositories[repositoryIndex]

  const updatedRepository = { ...repository, url, title, techs }

  repositories[repositoryIndex] = { ...updatedRepository }

  return response.status(200).json(updatedRepository)
})

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  )

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "Repository not found." })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).json({ message: "Deleted repository." })
})

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const uuidValidate = isUuid(id)

  if (!uuidValidate) {
    return response.status(400).json({ error: "Invalid project ID." })
  }

  const repository = repositories.find((repository) => repository.id === id)

  repository.likes += 1

  return response.status(200).json(repository)
})

module.exports = app
