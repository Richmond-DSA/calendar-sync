import config, { validateConfig } from "./config";
import getUpcomingCalendarEvents from "./google/getUpcomingEvents";
import type { Log } from "./models/interface";
/**
 * https://appwrite.io/docs/functions#functionVariables
 */
type AppwriteVariables =
  | 'APPWRITE_FUNCTION_ID'
  | "APPWRITE_FUNCTION_NAME"
  | "APPWRITE_FUNCTION_DEPLOYMENT"
  | "APPWRITE_FUNCTION_TRIGGER"
  | "APPWRITE_FUNCTION_RUNTIME_NAME"
  | "APPWRITE_FUNCTION_RUNTIME_VERSION"
  | "APPWRITE_FUNCTION_EVENT"
  | "APPWRITE_FUNCTION_EVENT_DATA"
  | "APPWRITE_FUNCTION_DATA"
  | "APPWRITE_FUNCTION_PROJECT_ID"
  | "APPWRITE_FUNCTION_USER_ID"
  | "APPWRITE_FUNCTION_JWT";

interface AppwriteResponse {
  binary: (bytes: BinaryType) => void;
  empty: () => void;
  json: (obj: Record<string, unknown>, status?: number) => void;
  redirect: (url: string, status: number) => void;
  send: (text: string, status?: number) => void;
  text: (text: string) => void;
};

interface FunctionParams {
  req: {
    headers: Record<string, string>;
    method: 'GET'|'POST'|'PUT'|'DELETE'|'OPTIONS'|'PATCH'
    payload: string;
    variables: Record<AppwriteVariables, string>;
  },
  res: AppwriteResponse,
  log: Log,
  error: (args: any) => void,
}

export default async ({ res, log, error }: FunctionParams) => {
  // validate our config right away (throws if incorrect.)
  validateConfig(config);
  try {
    const events = await getUpcomingCalendarEvents(log);
    log(`Retrieved ${events?.length || 0} calendar events`);
    log(events);
  } catch (err) {
    error(err);
  }
  return res.json({
    ok: true,
  });
};
