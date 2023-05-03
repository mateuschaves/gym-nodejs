# Gym NodeJS
🏋️‍♀️ 💪  Api feita usando fastify e prisma para gerenciar check-ins de academia

## Requisitos

[Node.js](https://nodejs.org/en) (versão 16.x ou superior)

[TypeScript](https://www.typescriptlang.org/) (versão 5 ou superior)

[Docker](https://www.docker.com)

## Instalação

 1. Clone o repositório: `git clone https://github.com/mateuschaves/gym-nodejs.git`
 2. Instale as dependências: `npm install`
 3. Crie um arquivo `.env` usando o modelo de exemplo `.env.example`
 4. Execute as migrations usando o comando: `npx prisma migrate deploy`

## Uso

Inicie o banco de dados utilizando o docker compose:

```bash
    docker-compose up --build
```

Para iniciar o servidor, utilize o seguinte comando:

```bash
    npm run start:dev
```

## Tests unitários

Execute os testes unitários utilizando o seguinte comando:

```bash
 npm run test

```

## Tests e2e

Execute os testes e2e utilizando o seguinte comando:

```bash
 npm run test:e2e
```

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter o seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após ser criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);

## Contribuição

 1. Faça o fork do projeto
 2. Crie sua feature branch (`git checkout -b feature/nome-da-feature`)
 3. Commit suas mudanças (`git commit -am 'Adicionando nova feature'`)
 4. Faça o push para o branch (`git push origin feature/nome-da-feature`)
 5. Crie um novo Pull Request
