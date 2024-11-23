export class Error {
  constructor(msg: string, details: Record<string, unknown> = {}) {
    return {
      success: false,
      errors: [
        {
          msg,
          details,
        },
      ],
    };
  }
}
