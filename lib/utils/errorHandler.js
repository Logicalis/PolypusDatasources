/**
 * @param {HTTP Response} res http response to send
 * @param {Error} error Error object to throw in response
 * @param {Number} [status=500] Status code.
 */
module.exports = function(res, error){
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
    res.send(status, JSON.parse(JSON.stringify(error))); // hack to send all error data in json format not just the message
}