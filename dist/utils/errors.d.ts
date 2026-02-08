export declare class CSGError extends Error {
    statusCode: number;
    code: string;
    constructor(message: string, statusCode?: number, code?: string);
}
export declare class AuthenticationError extends CSGError {
    constructor(message?: string);
}
export declare class RateLimitError extends CSGError {
    retryAfter?: number | undefined;
    constructor(message?: string, retryAfter?: number | undefined);
}
export declare class ProviderError extends CSGError {
    provider: 'openai' | 'google';
    constructor(message: string, provider: 'openai' | 'google', statusCode?: number);
}
export declare class TranspilerError extends CSGError {
    constructor(message: string);
}
//# sourceMappingURL=errors.d.ts.map