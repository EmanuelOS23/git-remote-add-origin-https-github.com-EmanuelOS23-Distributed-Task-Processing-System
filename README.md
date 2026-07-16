# Distributed Task Processing System

![Status](https://img.shields.io/badge/Status-Completed-success)
![Node](https://img.shields.io/badge/Node.js-20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Message_Broker-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

Um sistema distribuído robusto construído com **Node.js**, orquestrando processamento de tarefas em background através de mensageria assíncrona. Desenvolvido com foco em escalabilidade, resiliência e boas práticas de Engenharia de Software.

## 🏗 Arquitetura

O projeto foi desenhado sob o paradigma de **Microservices** em um ambiente de **Monorepo** (utilizando NPM Workspaces). As camadas internas de cada serviço seguem rigorosamente a **Clean Architecture** (SOLID, DRY, KISS, Repository Pattern).

A arquitetura é composta por:
1. **API Gateway**: Porta de entrada principal (REST API em Express). Recebe as requisições (ex: Cadastro de Tarefas), salva rapidamente no banco de dados com status `PENDING` e publica um evento de mensageria, devolvendo um `HTTP 202 Accepted` imediatamente para não bloquear o cliente.
2. **Worker Service**: Microsserviço independente (consumer) que escuta a fila do RabbitMQ. Ele puxa uma tarefa por vez (`prefetch=1`), processa as regras de negócio em background (simulando processos pesados com chance de falha controlada), atualiza o status no banco e gera auditoria (Logs de Tarefas).
3. **Shared / Prisma Layer**: Módulos compartilhados encapsulando os esquemas de banco de dados (ORM) e logs distribuídos (Winston).

## 🛠 Tecnologias

- **Linguagem**: TypeScript
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL, Prisma ORM
- **Mensageria**: RabbitMQ (amqplib)
- **Segurança**: JWT, Bcrypt
- **Validação**: Zod
- **Testes**: Jest
- **Infra/DevOps**: Docker, Docker Compose
- **Observabilidade**: Winston (Logs estruturados)


## 📸 Interface e Uso 

Toda a interação com o sistema é facilitada por uma interface limpa e documentada interativamente via **Swagger**. É por ela que os desenvolvedores e clientes interagem com a API.

### Tela Principal e Autenticação
<p align="center">
<img src="./screenshots/tela-principal.png">
</p>

### Cadastrando e Logando Usuários
O sistema possui rotas seguras para registro e login. O JWT (JSON Web Token) garante que apenas usuários autenticados consigam disparar novas tarefas.
<p align="center">
<img src="./screenshots/login.png">
</p>

### Enviando uma Nova Tarefa
Ao enviar uma tarefa, a API responde instantaneamente (Código `201 Created` / `202 Accepted`) com o Status `PENDING`, provando que o usuário não fica bloqueado.

<p align="center">
<img src="./screenshots/pending.png">
</p>

---

### Logs e Auditoria no Terminal do Worker
O Worker gera logs em tempo real que facilitam a observabilidade e auditoria, provando a natureza assíncrona do fluxo.

<p align="center">
<img src="./screenshots/worker.png">
</p>

---

## 🌟 Principais Benefícios desta Arquitetura

- **Alta Disponibilidade**: Se o Worker cair, o RabbitMQ segura as mensagens até ele voltar.
- **Escalabilidade Horizontal**: O trabalho está lento? Basta ligar 5, 10 ou 100 cópias do "Worker". Todos consumirão a mesma fila cooperativamente, dividindo o peso!
- **Desacoplamento**: O Gateway que atende o usuário e o Worker que processa o dado não se conhecem, eles apenas confiam no RabbitMQ, mantendo o sistema seguro contra falhas em cascata.

*Desenvolvido por Emanuel Oliveira Santos como demonstração de Arquitetura de Software.*
