import { Type, } from "@sinclair/typebox";
export const Nullable = (schema) => Type.Unsafe({
    ...schema,
    nullable: true,
});
export const createCommand = (command, execute) => {
    return {
        ...command,
        execute,
        _IS_COMMAND__: true,
    };
};
export const isCommand = (value) => {
    return (typeof value === "object" && value !== null && "_IS_COMMAND__" in value);
};
