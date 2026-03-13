import {
  type Static,
  type TBoolean,
  type TInteger,
  type TLiteral,
  type TNumber,
  type TObject,
  type TOptional,
  type TSchema,
  type TString,
  type TUnion,
  Type,
} from "@sinclair/typebox";
import type { Apis } from "../apis/index.ts";

export type SupportedSchema = TObject<{
  [key: string]:
    | TNumber
    | TInteger
    | TString
    | TBoolean
    | TUnion<TLiteral[]>
    | TLiteral
    | TOptional<TInteger | TNumber | TString | TBoolean | TUnion<TLiteral[]>>;
}>;

export const Nullable = <T extends TSchema>(schema: T) =>
  Type.Unsafe<Static<T> | null>({
    ...schema,
    nullable: true,
  });

export interface UserData {
  id: number;
  uuid: string;
}

export interface CommandExtra {
  user: UserData | null;
  apis: Apis;
  log: Pick<Console, "error" | "warn" | "info" | "debug">;
}

export type CommandExecute<Input extends SupportedSchema> = (
  args: Static<Input>,
  extra: CommandExtra,
) => Promise<unknown>;

export interface Command<Input extends SupportedSchema> {
  name: string;
  title?: string;
  description?: string;
  inputSchema?: Input;
  execute: CommandExecute<Input>;
  _IS_COMMAND__: true;
}

export const createCommand = <Input extends SupportedSchema>(
  command: Omit<Command<Input>, "execute" | "_IS_COMMAND__">,
  execute: CommandExecute<Input>,
): Command<Input> => {
  return {
    ...command,
    execute,
    _IS_COMMAND__: true,
  };
};

export const isCommand = (
  value: unknown,
): value is Command<SupportedSchema> => {
  return (
    typeof value === "object" && value !== null && "_IS_COMMAND__" in value
  );
};
