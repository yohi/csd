export class CSGError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code: string = 'INTERNAL_ERROR'
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class AuthenticationError extends CSGError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}

export class RateLimitError extends CSGError {
    constructor(
        message: string = 'Rate limit exceeded',
        public retryAfter?: number
    ) {
        super(message, 429, 'RATE_LIMIT_ERROR');
    }
}

export class ProviderError extends CSGError {
    constructor(
        message: string,
        public provider: 'openai' | 'google',
        statusCode: number = 502
    ) {
        super(message, statusCode, 'PROVIDER_ERROR');
    }
}

export class TranspilerError extends CSGError {
    constructor(message: string) {
        super(message, 500, 'TRANSPILER_ERROR');
    }
}
