/**
 * Parse stringified JSON arrays from API responses
 * Handles nested stringified arrays and returns a flat array
 */
export const parseArray = (field) => {
    if (!field || !Array.isArray(field)) return [];
    return field.map(item => {
        if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('{"'))) {
            try { return JSON.parse(item); } catch { return item; }
        }
        return item;
    }).flat();
};
