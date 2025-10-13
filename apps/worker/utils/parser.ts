
type EmailPayload = { email: string; subject:string; body: string };
type SolPayload   = { address: string; amount: number };
type XPostPayload = { 
    content: string; 
    connected: boolean;
};

type ParsedAction =
  | { type: 'email'; data: EmailPayload }
  | { type: 'sol';   data: SolPayload }
  | { type: 'x-post'; data: XPostPayload };

export function parseAction(action: {
  type: { id: string };
  metadata: any;
}): ParsedAction {
  switch (action.type.id) {
    case 'email':
      return {
        type: 'email',
        data: {
          email: action.metadata.email,
          subject: action.metadata.subject,
          body: action.metadata.body,
        },
      };

    case 'sol':
      return {
        type: 'sol',
        data: {
          address: action.metadata.address,
          amount: Number(action.metadata.amount),
        },
      };

    case 'x-post':
      return {
        type: 'x-post',
        data: {
          content: action.metadata.content,
          connected: action.metadata.connected,
        },
      };

    default:
      throw new Error(`Unsupported action type: ${action.type.id}`);
  }
}
