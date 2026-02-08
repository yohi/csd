export class CSGError extends Error {
    statusCode;
    code;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class AuthenticationError extends CSGError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}
export class RateLimitError extends CSGError {
    retryAfter;
    constructor(message = 'Rate limit exceeded', retryAfter) {
        super(message, 429, 'RATE_LIMIT_ERROR');
        this.retryAfter = retryAfter;
    }
}
export class ProviderError extends CSGError {
    provider;
    constructor(message, provider, statusCode = 502) {
        super(message, statusCode, 'PROVIDER_ERROR');
        this.provider = provider;
    }
}
export class TranspilerError extends CSGError {
    constructor(message) {
        super(message, 500, 'TRANSPILER_ERROR');
    }
}
//# sourceMappingURL=errors.js.map