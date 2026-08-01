import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

process.env.NEXT_PUBLIC_FIREBASE_API_KEY =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "test-api-key";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "test-auth-domain";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "test-project-id";
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "test-storage-bucket";
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "test-messaging-sender-id";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID =
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "test-app-id";

Object.assign(global, { TextEncoder, TextDecoder });

if (!global.fetch) {
    global.fetch = jest.fn();
}

if (!global.Response) {
    global.Response = class Response { } as unknown as typeof Response;
}

if (!global.Headers) {
    global.Headers = class Headers { } as unknown as typeof Headers;
}

if (!global.Request) {
    global.Request = class Request { } as unknown as typeof Request;
}
