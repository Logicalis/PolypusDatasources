module.exports = function(res, error){
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
    res.send(status, JSON.parse(JSON.stringify(error))); // hack to send all error data in json format not just the message
}