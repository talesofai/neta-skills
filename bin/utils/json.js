export function safeParseJson(json) {
    try {
        return JSON.parse(json);
    }
    catch {
        return null;
    }
}
