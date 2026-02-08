import { config } from '../config.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

class Logger {
    private minLevel: number;

    constructor(level: LogLevel = 'info') {
        this.minLevel = levels[level];
    }

    private log(level: LogLevel, message: string, ...args: any[]) {
        if (levels[level] >= this.minLevel) {
            const timestamp = new Date().toISOString();
            const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
            console.log(prefix, message, ...args);
        }
    }

    debug(message: string, ...args: any[]) {
        this.log('debug', message, ...args);
    }

    info(message: string, ...args: any[]) {
        this.log('info', message, ...args);
    }

    warn(message: string, ...args: any[]) {
        this.log('warn', message, ...args);
    }

    error(message: string, ...args: any[]) {
        this.log('error', message, ...args);
    }
}

export const logger = new Logger(config.logLevel as LogLevel);
