import 'dotenv/config';
export declare const config: {
    port: number;
    host: string;
    openai: {
        clientId: string;
        authUrl: string;
        tokenUrl: string;
        apiUrl: string;
        tokenPath: string;
        scopes: string[];
    };
    google: {
        clientId: string;
        clientSecret: string;
        authUrl: string;
        tokenUrl: string;
        apiUrl: string;
        tokenPath: string;
        scopes: string[];
        redirectUri: string;
    };
    logLevel: string;
};
//# sourceMappingURL=config.d.ts.map