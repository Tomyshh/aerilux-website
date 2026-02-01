declare module "*.png" {
  const value: string;
  export default value;
}

// PayMe Hosted Fields (loaded via <script> tag)
declare global {
  type PayMeTokenizeResult =
    | { type: 'tokenize-success'; token: string }
    | { type: string; errors?: unknown };

  type PayMeHostedFieldType = unknown;

  interface PayMeHostedField {
    mount: (selector: string) => void;
  }

  interface PayMeHostedFields {
    create: (field: PayMeHostedFieldType) => PayMeHostedField;
  }

  interface PayMeInstance {
    hostedFields: () => PayMeHostedFields;
    tokenize: (args: {
      payerFirstName: string;
      payerLastName: string;
      payerEmail: string;
      payerPhone: string;
      payerSocialId?: string;
      total: {
        label: string;
        amount: { currency: string; value: string };
      };
    }) => Promise<PayMeTokenizeResult>;
  }

  interface PayMeStatic {
    create: (apiKey: string, opts?: { testMode?: boolean }) => Promise<PayMeInstance>;
    fields: {
      NUMBER: PayMeHostedFieldType;
      EXPIRATION: PayMeHostedFieldType;
      CVC: PayMeHostedFieldType;
    };
  }

  interface Window {
    PayMe?: PayMeStatic;
  }
}

export {};