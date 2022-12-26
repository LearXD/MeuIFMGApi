<h1 align="center">Meu IFMG API - REST</h1>

<div align="center">
    <img src="https://img.shields.io/github/stars/LearXD/MeuIFMGApi?style=social" alt="Stars">
    <img src="https://img.shields.io/github/commit-activity/m/LearXD/MeuIFMGApi" alt="Commits">
    <img src="https://img.shields.io/github/license/LearXD/MeuIFMGApi" alt="License">
    <img src="https://img.shields.io/github/v/release/LearXD/MeuIFMGApi" alt="Release">
</div>
<br>


Uma API Rest que obtém dados por Web Scraping do site do MeuIFMG (novo) feita em NodeJS

<br>


# Rotas da API

> ## POST http://localhost/v1/login

<br>

### `BODY:` 

```json
{
    "registration": "0000000",
    "password": "suasenha"
}
```

<br>

### `Resposta:`
```json
{
    "token": "ASP.NET_SessionId=.....; .ASPXAUTH=....; .ASPXBrowserOverride=....; RedirectUrlContexto=https://meu.ifmg.edu.br:443/EducaMobile/Educacional/EduAluno/EduNotasFaltasEtapa?tp=A; EduTipoUser=A"
}
```


<br>
<br>

> ## GET http://localhost/v1/profile

<br>

### `HEADER:` 

```yaml
token: ASP.NET_SessionId=.....; .ASPXAUTH=....; .ASPXBrowserOverride=....; RedirectUrlContexto=https://meu.ifmg.edu.br:443/EducaMobile/Educacional/EduAluno/EduNotasFaltasEtapa?tp=A; EduTipoUser=A
```

<br>

### `Resposta:`
```json
{
    "name": "Nome do Estudante",
    "image": "base64 image"
}
```


<br>
<br>

> ## GET http://localhost/v1/historic

<br>

### `HEADER:` 

```yaml
token: ASP.NET_SessionId=.....; .ASPXAUTH=....; .ASPXBrowserOverride=....; RedirectUrlContexto=https://meu.ifmg.edu.br:443/EducaMobile/Educacional/EduAluno/EduNotasFaltasEtapa?tp=A; EduTipoUser=A
```

<br>

### `Resposta:`
```json
{
    "OUTROS": {...},
    "PRIMEIRO_ANO": {...},
    "SEGUNDO_ANO": {...},
    "TERCEIRO_ANO": {...},
    ...
}
```

<br>

<div align="center">
    <b>LearXD - 2022/23</b>
</div>