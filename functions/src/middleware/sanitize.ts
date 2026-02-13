/**
 * Sanitizes user input before passing to AI models.
 * Strips potential prompt injection patterns and control characters.
 */
export function sanitizeAIInput(input: string, maxLength: number = 500): string {
    let sanitized = input;

    // Remove control characters (except newlines and tabs)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Collapse excessive whitespace
    sanitized = sanitized.replace(/\s{3,}/g, '  ');

    // Strip common prompt injection patterns
    sanitized = sanitized
        .replace(/ignore\s+(all\s+)?previous\s+instructions?/gi, '')
        .replace(/you\s+are\s+now\s+/gi, '')
        .replace(/system\s*:\s*/gi, '')
        .replace(/\[INST\]/gi, '')
        .replace(/<\/?s>/gi, '')
        .replace(/<<SYS>>|<\/SYS>>/gi, '');

    // Truncate to max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized.trim();
}

/**
 * Validates a monetary amount is within acceptable bounds.
 */
export function validateAmount(amount: number, min: number = 1, max: number = 10000): string | null {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return 'Amount must be a valid number';
    }
    if (amount < min) {
        return `Amount must be at least $${min}`;
    }
    if (amount > max) {
        return `Amount cannot exceed $${max.toLocaleString()}`;
    }
    return null; // valid
}
