import * as yup from 'yup';

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false, 
      stripUnknown: true, 
    });
    
    return next();
  } catch (error) {
    return res.status(400).json({
      type: error.name,
      errors: error.errors, 
    });
  }
};
