declare module 'midtrans-client' {
    // Export the types and interfaces used by midtrans-client as needed.
    // This is a basic example; you may need to expand it based on the module's usage.
    
    class CoreApi {
      constructor(config: { isProduction: boolean; serverKey: string; clientKey: string });
      charge(parameter: object): Promise<object>;
      // Add other methods and properties as needed
    }
    
    class Snap {
      constructor(config: { isProduction: boolean; serverKey: string; clientKey: string });
      createTransaction(parameter: object): Promise<object>;
      // Add other methods and properties as needed
    }
    
    export { CoreApi, Snap };
  }
  