import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FundFlow API Documentation',
            version: '1.0.0',
            description: 'API documentation for FundFlow application',
            contact: {
                name: 'API Support',
                email: 'support@fundflow.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                Customer: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'nic', 'phoneNumber', 'monthlyIncome'],
                    properties: {
                        firstName: {
                            type: 'string',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            example: 'Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com'
                        },
                        nic: {
                            type: 'string',
                            example: '123456789V'
                        },
                        phoneNumber: {
                            type: 'string',
                            example: '+94771234567'
                        },
                        monthlyIncome: {
                            type: 'number',
                            format: 'float',
                            example: 50000
                        },

                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        statusCode: {
                            type: 'integer',
                            example: 400
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authentication'
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Access token is missing or invalid',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'number',
                                        example: 401
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Not authenticated or invalid token'
                                    }
                                }
                            }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'Not authorized to access this resource',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'number',
                                        example: 403
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Not authorized. Only admins can access this resource.'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

export const specs = swaggerJsdoc(options); 