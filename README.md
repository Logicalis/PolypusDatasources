---

# WARNING

## This repo has been archived!

NO further developement will be made in the foreseen future.

---


# Polypus Datasources

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is it for](#what-is-it-for)
- [Architecture](#architecture)
- [API Docs](#api-docs)
- [How to implement a new Adapter](#how-to-implement-a-new-adapter)
- [DataSources](#datasources)
- [Queries](#queries)
- [Admin Client](#admin-client)
- [Scripts](#scripts)
  - [Create DataSource](#create-datasource)
- [Implemented Adapters](#implemented-adapters)
- [Development Roadmap](#development-roadmap)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is it for

This component manages conections with various data sources and performing data queries.
This component has various data **Adapters** and new ones can be developed.
The adapters define how the connection to a data source is made and how the data is queried.

**DataSources** are entities that represent an instance of the connection of an Adapter.
The DataSource must have the attributes needed to connect to a data source, these attributes are defined by its adapter.
The Elasticsearch Adapter, for instance, defines that your DataSources must have the URL and the Index of an Elasticsearch database.

**Queries** are entities that represent queries to be made on a DataSource.
The Query must have the attributes needed to specify a query to a data source, which is defined by its DataSource.
The Elasticsearch Adapter, for instance, defines that Queries created over Elasticsearch DataSources have a Query object and a Type of an Elasticsearch database.

When a query is executed, the adapter will use the DataSource specification to connect to the data source and the Query specification to query the data.
The connection to the data saource can be made at the initialization of this service or before each query. This is defined by the Adapter.

This component has a Rest API that controls the management of DataSources and Queries.

## Architecture
![Polypus Diagram](./diagram.png)

## API Docs
The API is documented using [Swagger](http://swagger.io/). 
It serves the Swagger file in the url: http://localhost:4000/api/swagger
You can read it using an Swagger UI:

http://petstore.swagger.io/?url=http://localhost:4000/api/swagger#/default

Replace `localhost:4000` with the address and port of your running service.

## How to implement a new Adapter

Adapters are objects that specify the data needed to create DataSources and Queries from a data source.
They have functions that are responsible for connecting, overriding query parameters and querying a data source from the data provided by the Query and DataSource entities.

| Property | Description |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| displayName | Name to be used in UI. |
| name | Identifier name of the Adapter that must be referenced by the DataSources. Must be unique among other Adapters. |
| dataSourcePropertiesSchema | Mongoose Schema to specify the DataSources configuration attributes. Example: connection url, database name ... |
| queryPropertiesSchema | Mongoose Schema to specify the Queries configuration attributes. For example: SQL, Elasticsearch query object. |
| configure(dataSource) | A function that sets up a DataSource to allow it to receive queries. The function receives the DataSource as a parameter and must return a Promise that resolves with a configuration object. This object will be used to perform queries, according to the Adapter, it can be a connection to the data source, a pool of connections, or a simple object with DataSource information. |
| replaceParams(queryProperties, parameters) | Function that replaces the parameters sent to a query. The function receives the queryProperties from a query and the parameter object, and should return the queryProperties object with the replaced parameters. |
| execute(configuration, queryProperties) | Function that performs a query on the data source. Receives the configuration object created by the `configure` function and the queryProperties with the parameters already replaced by the `replaceParams` function. The function should return a promise that resolves with the resulting query data. |
| additionalProperties | Object with additional properties that can be used by client applications. |


## DataSources

| Property | Description |
|----------------------|-------------------------------------------------------------------------------------------------------|
| name | Unique DataSource Name |
| adapter | Adapter ID used by DataSource |
| dataSourceProperties | Object with DataSource attributes that are defined by the Adapter |
| additionalProperties | Object with additional properties that can be used by client applications to store extra information. |

## Queries

| Property | Description |
|----------------------|----------------------------------------------------------------------------|
| name | Query unique name |
| dataSource | DataSource ID referenced by Query |
| queryProperties | Object with Query attributes that are defined by the Adapter. |
| additionalProperties | Object with additional properties that can be used by client applications to store extra information. |


## Admin Client

See: [Polypus Datasources Admin](https://github.com/PromonLogicalis/PolypusDatasources-Admin)

## Scripts

### Create DataSource

In the 'scripts' folder we have the script to create DataSources.
Run:

    node ./scripts/createDataSource.js

In the script you must be informed of the address that the service is running.
In some cases it may be necessary to write the DataSourceProperties to JSON in the default system editor.

## Implemented Adapters
 - PostgreSQL
 - Elasticsearch
 - HTTP REST
 

## Development Roadmap

List of possible improvements and features in this service:
  - Graphical web interface for monitoring and entities management.
  - Adapters allow data pagination.
  - Cache query results avoiding repetitive queries, configurable, (assisting in pagination).
  - Other API interfaces and data transport, such as AMQP.
  - High availability with clustering.
  - Streams of data
  - Support for Big Data (queries that can't return in real time, must be processed as a job)
  - Adapters works as plugins (all adapters code inside the project will make the dependencies grow)
    -Maybe adapters working as protocols will allow to implement they in different programing languages.

Adapters to be implemented:
 - MongoDB
 - MySQL
 - Google Drive Spreadsheets
 - OracleSQL
 - Cassandra
 - CouchDB
 - RethinkDB
 - Redis
