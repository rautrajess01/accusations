import logger from "#config/logger.js";
import {signUpSchema, signInSchema} from "#validations/auth.validations.js";
import {formatValidationError} from "#utils/format.js"
import {createUser, authenticateUser } from "#services/auth.service.js";
import {jwttoken} from "#utils/jws.js";
import {cookies} from "#utils/cookies.js";
export const signUp = async (req, res, next) => {
 try {

  const validationResult = signUpSchema.safeParse(req.body);
  if (!validationResult.success) {
   return res.status(400).json({
    error: "Validation Failed",
    details: formatValidationError(validationResult.error)
   })
  };
  const { name, email, password, role } = validationResult.data;

  //AUTH SERVICE

  const user = await createUser({name, email, password, role}); 
  const token = jwttoken.sign({id: user.id, email: user.email, role: user.role});
  cookies.set(res, 'token', token)


  logger.info('User signed up successfully', { email });
  res.status(201).json({
   message: "User signed up successfully", user: {
    id: user.id, name: user.name, email:user.email, role:user.role
   }
  });
 }
 catch (e) {
  logger.error("Failed to sign up user", e);
  if (e.message == "User with this email already exists") {
   return res.status(409).json({ message: "Email already exist" });
  }
  next(e);
 }
}

export const signIn = async (req, res, next) => {
 try {
  const validationResult = signInSchema.safeParse(req.body);
  if (!validationResult.success) {
   return res.status(400).json({
    error: "Validation Failed",
    details: formatValidationError(validationResult.error)
   })
  };
  const { email, password } = validationResult.data;

  //AUTH SERVICE
  const user = await authenticateUser(email, password); 
  const token = jwttoken.sign({id: user.id, email: user.email, role: user.role});
  cookies.set(res, 'token', token)

  logger.info('User signed in successfully', { email });
  res.status(200).json({
   message: "User signed in successfully", user: {
    id: user.id, name: user.name, email: user.email, role: user.role
   }
  });
 }
 catch (e) {
  logger.error("Failed to sign in user", e);
  if (e.message === "User not found" || e.message === "Invalid password") {
   return res.status(401).json({ message: "Invalid email or password" });
  }
  next(e);
 }
}

export const signOut = async (req, res, next) => {
 try {
  cookies.clear(res, 'token');
  logger.info('User signed out successfully');
  res.status(200).json({
   message: "User signed out successfully"
  });
 }
 catch (e) {
  logger.error("Failed to sign out user", e);
  next(e);
 }
}
