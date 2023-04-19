# Desafio-Trampay-Back-End

<h1 align="center">
  Desafio Trampay
</h1>
<div align="center">

<h3>Built With</h3>

  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" height="30px"/>
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" height="30px"/>

  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<br/>

# Sumário

- [Descrição](#description)
- [Link repositório front-end](#front-end)
- [Entrega feita](#done)
- [Deploy](#deploy)
- [Documentação da API](#api-reference)
  - [Rotas de autenticação](#authentication-routes)
    - [Criar uma conta](#sign-up)
    - [Acessar uma conta](#sign-up)
    - [Recuperação de senha](#redefine-password)
    - [Mudança de senha](#set-password)
  - [Rota de Saldo do usuário](#user-balance-routes)
    - [Upload CSV](#post-csv)
- [Rodar localmente](#run-local)
- [Rodar os testes localmente](#run-tests-local)
- [Rodar com docker](#run-docker)

<div id='description'/>

# Descrição

Esse projeto foi feito baseado no processo seletivo de desenvolvedor na Trampay

#

<div id='front-end'/>

# Link repositório front-end

- [Link Repositório Front-End](https://github.com/ThVinicius/trampay-front-end)
- [Link Deploy Front-End](https://desafio-trampay-thvinicius.vercel.app/)

<div id='done'/>

## Entrega feita

- Criar uma conta
- Acessar uma conta
- Recuperação de senha
  - Com envio de email para recuperar ela
- Upload de arquivo CSV
- Testes unitários com cobertura de 100% na camada de serviços
- Aplicação com docker

</br>

<div id='deploy'/>

# Deploy

[Link deploy back-end](https://desafio-trampay.up.railway.app/)

#

<div id='api-reference'/>

# Documentação da API

<div id='authentication-routes'/>

## Rotas de autenticação

<div id='sign-up'/>

### Criar uma conta

```http
POST /api/sign-up
```

<h2>Request:</h2>
Enviar no body da requisição

| Params            | Type     | Description                                      |
| :---------------- | :------- | :----------------------------------------------- |
| `email`           | `string` | **Obrigatório**, **formato de email**,**trim**   |
| `password`        | `string` | **Obrigatório**, **trim**                        |
| `confirmPassword` | `string` | **Obrigatório**, **trim**, **Igual ao password** |

<h2>Response:</h2>

<h3>Em caso de erro:</h3>

| Status | Case                       |
| :----- | :------------------------- |
| `409`  | Conflito no campo de email |

<h3>Em caso de sucesso:</h3>

- Status code: 201
- O seguinte json como resposta:

```json
{
  "id": 1,
  "email": "vinicioss9955@gmail.com",
  "createdAt": "2023-04-18T16:45:10.734Z"
}
```

#

<div id='sign-in'/>

### Acessar uma conta

```http
POST /api/sign-in
```

<h2>Request:</h2>
Enviar no body da requisição

| Params     | Type     | Description                                    |
| :--------- | :------- | :--------------------------------------------- |
| `email`    | `string` | **Obrigatório**, **formato de email**,**trim** |
| `password` | `string` | **Obrigatório**, **trim**                      |

<h2>Response:</h2>

<h3>Em caso de erro:</h3>

| Status | Case                         |
| :----- | :--------------------------- |
| `401`  | Email ou password incorretos |

<h3>Em caso de sucesso:</h3>

- Status code: 200
- O seguinte json como resposta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidmluaWNpb3NzOTk1NUBnbWFpbC5jb20iLCJpYXQiOjE2ODE4MzY0Nzd9.4ELb4Q_hnqJUBhbdwBWeF1NKKuhXpPjGgz5ImjKqL6k"
}
```

#

<div id='redefine-password'/>

### Recuperação de senha

```http
POST /api/redefine-password
```

<h2>Request:</h2>
Enviar no body da requisição

| Params  | Type     | Description                                    |
| :------ | :------- | :--------------------------------------------- |
| `email` | `string` | **Obrigatório**, **formato de email**,**trim** |

<h2>Response:</h2>

<h3>Em caso de erro:</h3>

| Status | Case                 |
| :----- | :------------------- |
| `404`  | Email não encontrado |

<h3>Em caso de sucesso:</h3>

- Status code: 200
- Um email enviado para o email para mudar sua senha

#

<div id='set-password'/>

### Mudança de senha

```http
PATCH /api/set-password
```

<h2>Request:</h2>
Enviar no header da requisição o Bearer token

Ex: Bearer seu_token_jwt

| Params          | Type     | Description                              |
| :-------------- | :------- | :--------------------------------------- |
| `authorization` | `string` | **Obrigatório**, **Começar com Bearer ** |

Enviar no body da requisição

| Params            | Type     | Description                                      |
| :---------------- | :------- | :----------------------------------------------- |
| `password`        | `string` | **Obrigatório**, **trim**                        |
| `confirmPassword` | `string` | **Obrigatório**, **trim**, **Igual ao password** |

<h2>Response:</h2>

<h3>Em caso de erro:</h3>

| Status | Case                            |
| :----- | :------------------------------ |
| `400`  | Requisição no formato incorreto |
| `401`  | Token inválido                  |

<h3>Em caso de sucesso:</h3>

- Status code: 200
- O seguinte json como resposta

```json
{
  "id": 1,
  "email": "vinicioss9955@gmail.com"
}
```

#

<div id='user-balance-routes'/>

## Rota de Saldo do usuário

<div id='post-csv'/>

### Upload CSV

O arquivo CSV tem que ter as colunas documento e saldo

```http
POST /api/user-balance
```

<h2>Request:</h2>
Enviar no header da requisição o Bearer token

Ex: Bearer seu_token_jwt

| Params          | Type     | Description                              |
| :-------------- | :------- | :--------------------------------------- |
| `authorization` | `string` | **Obrigatório**, **Começar com Bearer ** |

Enviar no Form Fields (Form Data) da requisição

| Params | Type   | Description                                                |
| :----- | :----- | :--------------------------------------------------------- |
| `csv`  | `file` | **Obrigatório**, **A extensão do arquivo tem que ser CSV** |

<h2>Response:</h2>

<h3>Em caso de erro:</h3>

| Status | Case                            |
| :----- | :------------------------------ |
| `400`  | Requisição no formato incorreto |
| `401`  | Token inválido                  |

<h3>Em caso de sucesso:</h3>

- Status code: 200
- O seguinte json como resposta

```json
[
  {
    "id": 28,
    "user_id": 1,
    "document": "123.456.789.15",
    "balance": 270,
    "createdAt": "2023-04-18T17:05:37.770Z",
    "deletedAt": null
  },
  {
    "id": 29,
    "user_id": 1,
    "document": "789.456.123.14",
    "balance": 99,
    "createdAt": "2023-04-18T17:05:37.770Z",
    "deletedAt": null
  }
]
```

#

<div id='run-local'/>

# Rodar localmente

Versão do node: 18.15.0

- Crie o arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`
- Instale as dependencias: `npm install`
- Crie o banco de dados: `npx prisma migrate dev`
- Inicie com o comando: `npm run start:dev`
  - A aplicação ficará disponivel na porta 3000: http://localhost:3000

#

<div id='run-tests-local'/>

# Rodar os testes localmente

```bash
npm run test
```

<div id='run-docker'/>

# Rodar com docker

- Crie o arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`
  - modifique a variável `DATABASE_URL="postgresql://postgres:123@postgres_development:5432/trampay?schema=public"`
- Inicie com o comando: `docker-compose -f docker-compose-dev.yml up --build -d`
  - A aplicação ficará disponivel na porta 3000: http://localhost:3000
  - Para terminar a aplicação use o comando: `docker-compose -f docker-compose-dev.yml down`

</br>

## Acknowledgements

- [Awesome Badges](https://github.com/Envoy-VC/awesome-badges)

</br>
