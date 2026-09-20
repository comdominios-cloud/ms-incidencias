const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ms-incidencias API',
            version: '1.0.0',
            description: 'API para incidencias y reservas de areas comunes'
        },
        servers: [
            {
                url: 'http://localhost:3003'
            }
        ]
    },

    apis: [
        './src/routes/*.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;