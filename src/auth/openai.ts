import axios from 'axios';
import open from 'open';
import { config } from '../config.js';
import { tokenStore } from './token-store.js';
import { logger } from '../utils/logger.js';
import { AuthenticationError } from '../utils/errors.js';

interface DeviceCodeResponse {
    device_code: string;
    user_code: string;
    verification_uri: string;
    verification_uri_complete: string;
    expires_in: number;
    interval: number;
}

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
}

export class OpenAIAuth {
    private async requestDeviceCode(): Promise<DeviceCodeResponse> {
        try {
            const response = await axios.post<DeviceCodeResponse>(
                config.openai.authUrl,
                {
                    client_id: config.openai.clientId,
                    scope: config.openai.scopes.join(' ')
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            return response.data;
        } catch (error) {
            logger.error('Failed to request device code:', error);
            throw new AuthenticationError('Failed to initiate OpenAI authentication');
        }
    }

    private async pollForToken(deviceCode: string, interval: number): Promise<TokenResponse> {
        const maxAttempts = 60; // 5 minutes max
        let attempts = 0;

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, interval * 1000));

            try {
                const response = await axios.post<TokenResponse>(
                    config.openai.tokenUrl,
                    {
                        client_id: config.openai.clientId,
                        device_code: deviceCode,
                        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
                    },
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }
                );

                return response.data;
            } catch (error: any) {
                const errorCode = error.response?.data?.error;

                if (errorCode === 'authorization_pending') {
                    attempts++;
                    continue;
                } else if (errorCode === 'slow_down') {
                    interval += 5;
                    attempts++;
                    continue;
                } else if (errorCode === 'expired_token') {
                    throw new AuthenticationError('Device code expired. Please try again.');
                } else if (errorCode === 'access_denied') {
                    throw new AuthenticationError('Access denied by user.');
                } else {
                    throw new AuthenticationError(`Authentication failed: ${errorCode}`);
                }
            }
        }

        throw new AuthenticationError('Authentication timeout. Please try again.');
    }

    async login(): Promise<void> {
        logger.info('Starting OpenAI (Codex) authentication...');

        const deviceCode = await this.requestDeviceCode();

        logger.info(`\n🔐 OpenAI Authentication Required`);
        logger.info(`\n📋 User Code: ${deviceCode.user_code}`);
        logger.info(`🌐 Opening browser: ${deviceCode.verification_uri_complete}\n`);

        // Open browser
        await open(deviceCode.verification_uri_complete);

        logger.info('⏳ Waiting for authorization...');

        const token = await this.pollForToken(deviceCode.device_code, deviceCode.interval);

        // Save token
        await tokenStore.save(config.openai.tokenPath, {
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            expires_at: Date.now() + (token.expires_in * 1000),
            scope: token.scope
        });

        logger.info('✅ OpenAI authentication successful!');
    }

    async getValidToken(): Promise<string> {
        const tokenData = await tokenStore.load(config.openai.tokenPath);

        if (!tokenData) {
            throw new AuthenticationError('No OpenAI token found. Please run: claude-gateway auth codex');
        }

        // Check if token is still valid
        if (tokenStore.isTokenValid(tokenData)) {
            return tokenData.access_token;
        }

        // Refresh token
        logger.info('Refreshing OpenAI token...');

        try {
            const response = await axios.post<TokenResponse>(
                config.openai.tokenUrl,
                {
                    client_id: config.openai.clientId,
                    refresh_token: tokenData.refresh_token,
                    grant_type: 'refresh_token'
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            const newTokenData = {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token ?? tokenData.refresh_token,
                expires_at: Date.now() + (response.data.expires_in * 1000),
                scope: response.data.scope
            };

            await tokenStore.save(config.openai.tokenPath, newTokenData);

            logger.info('✅ Token refreshed successfully');
            return newTokenData.access_token;
        } catch (error) {
            logger.error('Failed to refresh token:', error);
            await tokenStore.delete(config.openai.tokenPath);
            throw new AuthenticationError('Token refresh failed. Please re-authenticate: claude-gateway auth codex');
        }
    }
}

export const openaiAuth = new OpenAIAuth();
