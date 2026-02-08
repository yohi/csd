import { type Request, type Response } from 'express';

export const handleModels = async (req: Request, res: Response) => {
    // Return list of available models
    res.json({
        object: 'list',
        data: [
            {
                id: 'gpt-4o',
                object: 'model',
                created: Date.now(),
                owned_by: 'openai-via-codex'
            },
            {
                id: 'gpt-4o-mini',
                object: 'model',
                created: Date.now(),
                owned_by: 'openai-via-codex'
            },
            {
                id: 'gemini-1.5-pro',
                object: 'model',
                created: Date.now(),
                owned_by: 'google-via-antigravity'
            },
            {
                id: 'gemini-2.0-flash-exp',
                object: 'model',
                created: Date.now(),
                owned_by: 'google-via-antigravity'
            }
        ]
    });
};
