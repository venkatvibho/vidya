const { body, validationResult } = require('express-validator');

const valiDations = async (req, res , next) => {
    let PathVal = req.route.path.split('/')
    // check for password
    // await body('password', 'password is required').notEmpty().run(req)
    switch (PathVal[0]) {
        case 'User':
            await body('first_name').isAlpha('en-US', {ignore: ' '}).withMessage('Name must be alphabetic.').run(req)
            await body('phonenumber').isLength({min:10,max:10}).withMessage('Phone number should be 10 digits ').run(req)
            break;
        default:
            next();
    }
    // check for errors
    const errors = validationResult(req);
    console.log(errors.errors);
    // if error show the first one as they happen
    if (!errors.isEmpty()) {
        const firstError = errors.errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
}
module.exports = valiDations;