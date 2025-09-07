import { Platform } from 'react-native';

export function installGlobalErrorHandlers(): void {
  // Capture uncaught JS exceptions
  const defaultHandler = (global as any).ErrorUtils?.getGlobalHandler?.();
  (global as any).ErrorUtils?.setGlobalHandler?.((error: any, isFatal?: boolean) => {
    try {
      console.error('Global JS Error', { error, isFatal });
    } catch {}
    try {
      defaultHandler?.(error, isFatal);
    } catch {}
  });

  // Capture unhandled promise rejections when supported
  try {
    const g: any = globalThis as any;
    if (typeof g.onunhandledrejection !== 'undefined') {
      g.onunhandledrejection = (event: any) => {
        const reason = event?.reason ?? event;
        console.error('Unhandled promise rejection', reason);
      };
    } else {
      // Best-effort console patching for environments without onunhandledrejection
      const origConsoleError = console.error.bind(console);
      console.error = (...args: any[]) => {
        // surface potential async errors prominently
        origConsoleError('[ConsoleError]', ...args);
      };
    }
  } catch {
    // no-op
  }
}