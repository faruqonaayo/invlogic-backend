export default function serverResponse(res, statusCode, message, options) {
  return res.status(statusCode).json({ message, statusCode, ...options });
}
