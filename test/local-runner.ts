import main from '../index'
import type { Log } from "../models/interface";

// Mock Appwrite environment
const mockAppwriteVariables = {
  APPWRITE_FUNCTION_ID: 'test-function-id',
  APPWRITE_FUNCTION_NAME: 'calendar-sync',
  APPWRITE_FUNCTION_DEPLOYMENT: 'test-deployment',
  APPWRITE_FUNCTION_TRIGGER: 'schedule',
  APPWRITE_FUNCTION_RUNTIME_NAME: 'node-18.0',
  APPWRITE_FUNCTION_RUNTIME_VERSION: '18.0',
  APPWRITE_FUNCTION_EVENT: '',
  APPWRITE_FUNCTION_EVENT_DATA: '',
  APPWRITE_FUNCTION_DATA: '',
  APPWRITE_FUNCTION_PROJECT_ID: 'test-project',
  APPWRITE_FUNCTION_USER_ID: '',
  APPWRITE_FUNCTION_JWT: ''
} as const;

// Mock response object
const mockResponse = {
  binary: (_bytes: BinaryType) => console.log('Response: Binary data sent'),
  empty: () => console.log('Response: Empty response'),
  json: (obj: Record<string, unknown>, status = 200) => {
    console.log(`Response: JSON (${status}):`, JSON.stringify(obj, null, 2));
  },
  redirect: (url: string, status: number) => console.log(`Response: Redirect to ${url} (${status})`),
  send: (text: string, status = 200) => console.log(`Response: Text (${status}):`, text),
  text: (text: string) => console.log('Response: Text:', text)
};

// Mock log function
const mockLog: Log = (...args: any[]) => {
  console.log('[LOG]', ...args);
};

// Mock error function
const mockError = (...args: any[]) => {
  console.error('[ERROR]', ...args);
};

// Mock request object
const mockRequest = {
  headers: {},
  method: 'GET' as const,
  payload: '',
  variables: mockAppwriteVariables
};

async function runLocally() {
  console.log('🚀 Starting local calendar-sync function test...\n');
  
  try {
    await main({
      req: mockRequest,
      res: mockResponse,
      log: mockLog,
      error: mockError
    });
    console.log('\n✅ Function completed successfully');
  } catch (error) {
    console.error('\n❌ Function failed:', error);
  }
}

runLocally();