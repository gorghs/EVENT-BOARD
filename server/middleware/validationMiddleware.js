const Joi = require('joi');

const eventCreateSchema = Joi.object({
    title: Joi.string().trim().min(3).max(255).required().messages({
        'string.empty': 'Title is required.',
        'string.min': 'Title must be at least 3 characters.',
    }),
    date: Joi.date().iso().required(),
    location: Joi.string().max(255).allow('', null),
    description: Joi.string().max(1000).allow('', null),
    status: Joi.string().valid('draft', 'published').default('draft'),
});

const eventUpdateSchema = Joi.object({
    title: Joi.string().trim().min(3).max(255),
    date: Joi.date().iso(),
    location: Joi.string().max(255).allow('', null),
    description: Joi.string().max(1000).allow('', null),
    status: Joi.string().valid('draft', 'published'),
}).min(1);

exports.validateEventCreate = (req, res, next) => {
    const { error } = eventCreateSchema.validate(req.body, { abortEarly: false, allowUnknown: false });
    if (error) {
        return res.status(400).json({
            error: 'Validation Failed',
            details: error.details.map(d => d.message),
        });
    }
    next();
};

exports.validateEventUpdate = (req, res, next) => {
    const { error } = eventUpdateSchema.validate(req.body, { abortEarly: false, allowUnknown: false });
    if (error) {
        return res.status(400).json({
            error: 'Validation Failed',
            details: error.details.map(d => d.message),
        });
    }
    next();
};