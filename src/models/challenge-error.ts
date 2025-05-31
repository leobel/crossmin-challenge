export class ChallengeError extends Error {
    reason: any;
  
    constructor(message: string, reason: any) {
      super(message);
      this.name = 'ChallengeError';
      this.reason = reason;
    }
  }
  
  // Usage
//   throw new CustomError('Something went wrong', { code: 123, context: 'UserModule' });
  