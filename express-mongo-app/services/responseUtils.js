class Conflict409Error extends Error {
    constructor(message) {
        super(message);
        this.name = 'Conflict409Error';
        this.statusCode = 409;
    }
}

class BadRequest400Error extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequest400Error';
        this.statusCode = 400;
    }
}

class NotFound404Error extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequest404Error';
        this.statusCode = 404;
    }
}

module.exports = {Conflict409Error, BadRequest400Error, NotFound404Error}