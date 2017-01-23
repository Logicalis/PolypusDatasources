module.exports = function(string, parameters){
    var regex = /\${([^}]+)}/g;
    var stringReplaced = string.replace(regex, (param, key, offset, string) => {
        return parameters[key.trim()] || "";
    });
    return stringReplaced;
}