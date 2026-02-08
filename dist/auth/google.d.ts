export declare class GoogleAuth {
    private startLocalServer;
    private buildAuthUrl;
    private exchangeCodeForToken;
    login(): Promise<void>;
    getValidToken(): Promise<string>;
}
export declare const googleAuth: GoogleAuth;
//# sourceMappingURL=google.d.ts.map