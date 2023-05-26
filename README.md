<h1 align="center">Meu IFMG API - REST</h1>

<div align="center">
    <img src="https://img.shields.io/github/stars/LearXD/MeuIFMGApi?style=social" alt="Stars">
    <img src="https://img.shields.io/github/commit-activity/m/LearXD/MeuIFMGApi" alt="Commits">
    <img src="https://img.shields.io/github/license/LearXD/MeuIFMGApi" alt="License">
    <img src="https://img.shields.io/github/v/release/LearXD/MeuIFMGApi" alt="Release">
</div>
<br>


### Uma API Rest que obtém dados por Web Scraping do site do MeuIFMG (novo) feita em NodeJS

<br>


## Documentação da API

#### Login

```http
  POST /v1/login
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `registration` | `string` | **Obrigatório**. O numero de matricula do usuario |
| `password` | `string` | **Obrigatório**. A senha do usuário |

#### Dados de usuário (foto/nome)

```http
  GET /v1/profile
```

| Header   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token`      | `string` | **Obrigatório**. Token de login `literal` obtido em login|

#### Historico (todas as notas, faltas, e situações de todos os cursos)

```http
  GET /v1/historic
```

| Header   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token`      | `string` | **Obrigatório**. Token de login `literal` obtido em login|


#### Porcentagem de presenças

```http
  GET /v1/warnings
```

| Header   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token`      | `string` | **Obrigatório**. Token de login `literal` obtido em login|

#### Todas as materias do periodo letivo atual do usuário (selecionado por contexto)

```http
  GET /v1/subjects
```

| Header   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token`      | `string` | **Obrigatório**. Token de login `literal` obtido em login|

#### Todas as materias do periodo letivo atual do usuário (selecionado por contexto)

```http
  GET /v1/assessments?id=(id obtido em subjects)
```

| Header   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token`      | `string` | **Obrigatório**. Token de login `literal` obtido em login|


<br>

<div align="center">
    <b>LearXD - 2022/23</b>
</div>