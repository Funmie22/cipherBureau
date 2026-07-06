export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      vstack: {
        grow?: boolean;
        alignment?: string;
        children?: any;
      };
      webview: {
        id?: string;
        url?: string;
        onMessage?: (message: any) => Promise<void> | void;
        grow?: boolean;
        children?: any;
      };
    }
  }
}
