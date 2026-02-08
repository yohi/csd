type LogLevel = 'debug' | 'info' | 'warn' | 'error';
declare class Logger {
    private minLevel;
    constructor(level?: LogLevel);
    private log;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map