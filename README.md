<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Desafio Técnico - EclipseWorks

O projeto foi implementado de forma a atender aos requisitos definidos, e estes foram implementados junto a uma funcionalidade adicional. Foram aplicados  conceitos e boas práticas, como a separação de responsabilidades, a validação de entrada, a persistência de dados e a documentação básica. O código foi estruturado de forma modular e foram realizados testes unitários para garantir a qualidade do código implementado, embora não tenham cobrido todas as funcionalidades desenvolvidas.

## Pré-requisitos

- Node.js (versão 16.16 ou superior)
- Docker

## Instalação

1. Clone o Repositório
```bash
git clone https://github.com/octavio1199/crypto-offers-api.git
```


2. Instale as dependências 
```
npm install
```


3. Inicie o Banco de Dados com o docker-compose
```
docker-compose up -d
```


4. Execute o comando para rodar as migrations e popular o banco de dados
```bash
npm run seed
```

## Instruções para utilização
- Inicie a aplicação:

```bash
npm run start:dev
```

- Acesse o Swagger para explorar os endpoints e realizar os testes: http://localhost:8000/api-docs ou utilize uma ferramenta como o Postman ou Insomnia para realizar requisições HTTP aos endpoints da API.

- Acesse o Banco de Dados com as credenciais:
```
host: localhost
port: 5432
user: postgres
password: docker
database: crypto_offers

```

## Execução dos Testes

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

# Melhorias para o projeto

1. Arquitetura Limpa
   - A implementação de uma arquitetura limpa permite a aplicação dos princípios SOLID como a separação de responsabilidades e a criação de componentes independentes, facilitando a manutenção, evolução do sistema e as trocas de tecnologias (libs ou frameworks), caso necessário. Além disso, a arquitetura limpa permite a implementação de testes automatizados de forma mais simples e eficiente, principalmente se tratando das regras de negócio.

2. Testes unitários e de integração
   - Aumentar a cobertura de testes unitários e de integração para garantir a estabilidade e robustez do sistema. Além dos testes já implementados, é recomendado adicionar testes para cenários adicionais, como casos de erro, fluxos de exceção e validação de entrada.

3. Desempenho:
   - Analisar o desempenho da aplicação e identificar possíveis pontos de gargalo. Implementar melhorias, como otimização de consultas ao banco de dados, cache de dados, estratégias de paginação eficientes e outras técnicas de melhoria de desempenho específicas ao contexto da aplicação.

4. Escalabilidade e arquitetura:
   - Para torná-la mais escalável e fácil de manter. Pode ser interessante envolver a separação dos demais componentes da aplicação (que não foram implementados) em microserviços, a adoção de uma arquitetura baseada em eventos, a utilização de serviços de nuvem para escalabilidade automática, entre outras estratégias.

5. Padrões de Projeto:
   -  O padrão Repository, por exemplo, pode ser utilizado para abstrair a camada de persistência de dados e facilitar a troca de tecnologias de banco de dados, caso necessário. O padrão Factory pode ser utilizado para abstrair a criação de objetos e facilitar a criação de novos tipos de ofertas, caso necessário. O padrão Builder pode ser utilizado para facilitar a criação de objetos complexos, como a criação de uma oferta com vários itens, por exemplo. O padrão Decorator pode ser utilizado para adicionar novas funcionalidades a uma oferta, como a adição de um desconto, por exemplo. O padrão Observer pode ser utilizado para notificar os usuários sobre novas ofertas, por exemplo.
