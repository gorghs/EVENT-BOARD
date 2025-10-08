const Joi = require('joi');

const eventSchema = Joi.object({
    title: Joi.string().trim().min(5).max(255).required().messages({
        'string.empty': 'Title is required.',
        'string.min': 'Title must be at least 5 characters.',
    }),
    date: Joi.date().iso().required(),
    location: Joi.string().max(255),
    description: Joi.string().max(1000).allow(null, ''),
    status: Joi.string().valid('draft', 'published').default('draft'),
});

exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body, { abortEarly: false, allowUnknown: false });
    if (error) {
        return res.status(400).json({
            error: 'Validation Failed',
            details: error.details.map(d => d.message),
        });
    }
    next();
};