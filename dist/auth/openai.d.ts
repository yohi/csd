export declare class OpenAIAuth {
    private requestDeviceCode;
    private pollForToken;
    login(): Promise<void>;
    getValidToken(): Promise<string>;
}
export declare const openaiAuth: OpenAIAuth;
//# sourceMappingURL=openai.d.ts.map