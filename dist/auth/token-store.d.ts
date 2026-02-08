interface TokenData {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
    scope?: string;
}
export declare class TokenStore {
    private encryptionKey;
    constructor(password?: string);
    private encrypt;
    private decrypt;
    save(path: string, tokenData: TokenData): Promise<void>;
    load(path: string): Promise<TokenData | null>;
    delete(path: string): Promise<void>;
    isTokenValid(tokenData: TokenData): boolean;
}
export declare const tokenStore: TokenStore;
export {};
//# sourceMappingURL=token-store.d.ts.map