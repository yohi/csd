import { config } from '../config.js';
const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};
class Logger {
    minLevel;
    constructor(level = 'info') {
        this.minLevel = levels[level];
    }
    log(level, message, ...args) {
        if (levels[level] >= this.minLevel) {
            const timestamp = new Date().toISOString();
            const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
            console.log(prefix, message, ...args);
        }
    }
    debug(message, ...args) {
        this.log('debug', message, ...args);
    }
    info(message, ...args) {
        this.log('info', message, ...args);
    }
    warn(message, ...args) {
        this.log('warn', message, ...args);
    }
    error(message, ...args) {
        this.log('error', message, ...args);
    }
}
export const logger = new Logger(config.logLevel);
//# sourceMappingURL=logger.js.map