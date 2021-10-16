const ErrorMessage = {
	404: 'The requested resource is not found',
	500: 'Internal server error, please try again later. If this error persist please contact our support.',
	10001: 'Username exist.',
};

/**
 * Custom User Error
 */
class UserError extends Error {
	/**
	 * Construct error with own message, error code and status code
	 * @param {int} errorCode own reference error code
	 * @param {int} statusCode http status code
	 */
	constructor(errorCode, statusCode = 400) {
		super(ErrorMessage[errorCode]);
		// assign the error class name in your custom error
		this.name = this.constructor.name;
		// capturing the stack trace keeps the reference to your error sclass
		Error.captureStackTrace(this, this.constructor);

		this.errorCode = errorCode;
		this.statusCode = statusCode;
	}
}

UserError.NOT_FOUND = 404;
UserError.USERNAME_EXIST = 10001;

module.exports = {
	UserError,
	ErrorMessage,
};
