import pino from "pino";

const PINO_LEVELS = new Set(["trace", "debug", "info", "warn", "error", "fatal", "silent"]);
const LEVEL_ALIASES: Record<string, string> = {
  warning: "warn",
  err: "error",
  critical: "fatal",
};

const rawLevel = (process.env.LOG_LEVEL ?? "info").toLowerCase().trim();
const level = PINO_LEVELS.has(rawLevel) ? rawLevel : (LEVEL_ALIASES[rawLevel] ?? "info");

const usePretty = process.env.NODE_ENV !== "production" && process.env.LOG_PRETTY === "true";

const logger = pino(
  {
    level,
    redact: {
      paths: [
        "token",
        "access_token",
        "refresh_token",
        "subject_token",
        "client_secret",
        "authorization",
        "req.headers.authorization",
        "headers.authorization",
      ],
      censor: "[REDACTED]",
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    ...(usePretty ? { transport: { target: "pino-pretty", options: { destination: 2 } } } : {}),
  },
  usePretty ? undefined : pino.destination(2)
);

export function createLogger(name: string) {
  return logger.child({ module: name });
}

export default logger;
