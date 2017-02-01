# DataSourceAPI

## Objetivo

Este componente é responsável por gerenciar conexões com fontes de dados diversas e realizar consultas de dados.

Está implementado no componente diversos **Adaptaders** de dados e novos podem ser implementados em JavaScript.
Os Adaptaders atuais são de Elasticsearch, HTTP Get request e PostgreSQL.
Os adaptdores definem como é feita a conexão a uma fonte de dados e como é feito a consulta destes dados.

**DataSources** são entidades cadastradas no serviço que são instâncias da conexão de um Adapter.
O DataSource deve ter os atributos necessários para se conectar à uma fonte de dados, esses atributos são definidos pelo seu adapter.
O Adapter de Elasticsearch, por exemplo, define que seus DataSources tenham a URL e o Index de um banco Elasticsearch.

**Queries** são entidades cadastradas no serviço que representam consultas a serem feitas sobre um DataSource.
A Query deve ter os atributos necessários para especificar uma consulta à uma fonte dados, esta definida pelo seu DataSource.
O Adapter de Elasticsearch, por exemplo, define que as Queries criadas sobre DataSources de Elasticsearch tenham uma Query e um Type de uma instância Elasticsearch.

Ao executar uma Query o Adapter utilizará a especificação do DataSource para se conectar na fonte de dados e a especificação da Query para consultar os dados.
A conexão com o banco pode ser feita na inicialização deste serviço ou antes de cada consultas. Isto é definido pelo Adapter.

Este componente possui uma API para ser consumida, ela basicamente controla o gerenciamento de DataSources e Queries.

## Arquitetura
![DataSourceAPI Diagram](./arquitetura.png)

## Documentação da API
Para acessar a documentação Swagger com a aplicação rodando:

http://10.55.71.127:8080/?url=http://localhost:4000/api/swagger#/default

Substitua `localhost:4000` pelo endereço e porta que a aplicação está rodando.

## Como implementar um novo Adapter

Os Adapters são objetos que especificam os dados necessários para criar DataSources e Queries de uma fonte de dados.
Eles possuem funções que são reponsáveis por se conectar, substituir parâmetros de consulta e realizar consultas em uma fonte de dados a partir dos dados fornecidos pelas entidades.

| Atributos                                  | Descrição                                                                                                                                                                                                                                                                                                                                                        |
|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| displayName                                | Nome para ser usado na exibição em GUI.                                                                                                                                                                                                                                                                                                                                                        |
| name                                       | Nome identificador do adapter que dever ser referenciado pelos DataSources. Deve ser único entre outros Adapters.                                                                                                                                                                                                                                                                              |
| dataSourcePropertiesSchema                 | Schema do Mongoose para especificar os atributos de configuração de DataSources. Exemplo: url de conexão, nome do database...                                                                                                                                                                                                                                                                  |
| queryPropertiesSchema                      | Schema do Mongoose para especificar os atributos de configuração de Queries. Por exemplo: SQL, objeto de query do Elasticsearch.                                                                                                                                                                                                                                                               |
| configure(dataSource)                      | Função que configura um DataSource para permitir que ele receba consultas. A função recebe o DataSource como parâmetro e deve retornar uma Promise que resolve com um objeto de configuração. Este objeto será usado para realizar consultas, de acordo com o Adapter, ele pode ser uma conexão com a fonte de dados, um pool de conexões, ou um simples objeto com informações do DataSource. |
| replaceParams(queryProperties, parameters) | Função que substitui os os parâmetros enviados para um consulta. A função recebe o queryProperties de uma consulta e o objeto de parametros, e deve retornar o objeto de queryProperties com os parâmetros substituídos.                                                                                                                                                                       |
| execute(configuration, queryProperties)    | Função que executa uma consulta na fonte de dados. Recebe o objeto de configuração criado pela função `configure` e o queryProperties com os parâmetros já substituídos pela função `replaceParams`. A função deve retornar uma promise que resolve com os dados resultantes da consulta.                                                                                                      |
| additionalProperties                       | Objeto com propriedades adicionais que podem ser usadas pelas aplicações clientes do DataSourceAPI.                                                                                                                                                                                                                                                                                         |


## DataSources

| Atributos            | Descrição                                                                                           |
|----------------------|-----------------------------------------------------------------------------------------------------|
| name                 | Nome único do DataSource                                                                            |
| adapter              | ID do Adapter utilizado pelo DataSource                                                             |
| dataSourceProperties | Objeto com atributos do DataSource que são definidos pelo Adapter                                   |
| additionalProperties | Objeto com propriedades adicionais que podem ser usadas pelas aplicações clientes do DataSourceAPI. |

## Queries

| Atributos            | Descrição                                                                                           |
|----------------------|-----------------------------------------------------------------------------------------------------|
| name                 | Nome único da Query                                                                                 |
| dataSource           | ID do DataSource referenciado pela Query                                                            |
| queryProperties      | Objeto com atributos da Query que são definidos pelo Adapter.                                       |
| additionalProperties | Objeto com propriedades adicionais que podem ser usadas pelas aplicações clientes do DataSourceAPI. |
