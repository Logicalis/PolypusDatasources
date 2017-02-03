const restify = require('restify');
const inquirer = require('inquirer');

var adapters = ['elasticsearch','httprequest','postgresql'];

var whenElastic = function(answers){
    return answers.adapter == 'elasticsearch';
};
var whenNotElastic = function(answers){
    return answers.adapter != 'elasticsearch';
};
// var whenPostgres = function(answers){
//     return answers.adapter == 'postgresql';
// };
// var whenHttp = function(answers){
//     return answers.adapter == 'httprequest';
// };

var questions = [
    {name: "address", type: 'input', message: "Where is the DataSourceAPI server? Let empty for default: http://localhost:4000.",default: "http://localhost:4000"},
    {name: "adapter", type:'list', choices: adapters, message: "Select the Adapter for the DataSource:"},
    {name: "name", type: 'input', message: "Name of the DataSource:"},
    {name: "dataSourceProperties.url", type: 'input', message: "Elasticsearch URL:", when: whenElastic},
    {name: "dataSourceProperties.index", type: 'input', message: "Elasticsearch Index:", when: whenElastic},
    {name: "dataSourceProperties", type: 'editor', message: "DataSource properties:", when: whenNotElastic, filter: JSON.parse},
    {name: "additionalProperties", type: 'editor', message: "Additional properties:", filter: JSON.parse}
];

inquirer.prompt(questions).then((dataSource) => {
    var address = dataSource.address;
    delete dataSource.address;
    var client = restify.createJsonClient(address);

    client.post('/api/datasources',dataSource,(err,req,res,obj) => {
        if(err){
            console.error(err);
            return;
        }
        console.log("Status:",res.statusCode);
        console.log("Response body:\n",obj);
    });    
});