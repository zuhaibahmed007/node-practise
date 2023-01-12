const Validator = require('validatorjs');
const { isWeb } = require('../routeHelpers');

const loginRequest = (req, res, next) => {
    const validationRule = {
        "email": "required|string|email",
        "password": "required|string|min:6",
    };

    const validation = new Validator(req.body, validationRule, {});
    validation.passes(() => next());
    if (isWeb) {
        validation.fails(() =>
            res.status(400).render('login',
                {
                    success: false,
                    message: 'Validation failed',
                    data: validation.errors.errors,
                    form: req.body
                }
            )
        );
    } else {
        validation.fails(() => res.status(400)
            .json({
                success: false,
                message: 'Validation failed',
                data: validation.errors
            }));
    }
};

const registerRequest = (req, res, next) => {
    const validationRule = {
        "first_name": "required|string",
        "last_name": "required|string",
        "email": "required|string|email",
        "password": "required|string|min:6",
    };

    const validation = new Validator(req.body, validationRule, {});
    validation.passes(() => next());
    if (isWeb) {
        validation.fails(() =>
            res.status(400).render('register',
                {
                    success: false,
                    message: 'Validation failed',
                    data: validation.errors.errors,
                    form: req.body
                }
            )
        );
    } else {
        validation.fails(() =>
            res.status(400)
                .json({
                    success: false,
                    message: 'Validation failed',
                    data: validation.errors
                }));
    }
};

module.exports = {
    loginRequest,
    registerRequest
};