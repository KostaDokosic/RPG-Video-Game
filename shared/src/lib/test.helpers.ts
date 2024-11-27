import { sendMessage } from './messaging';
import { Password } from './password';
import { AccountRole, IAccount } from './types';

export async function createAndSigninTestAccount(
  name: string
): Promise<IAccount & { token: string }> {
  const password = await Password.hash('TesterTester123');
  const data = {
    name,
    password,
    role: AccountRole.gamemaster.toLowerCase(),
  };

  return await sendMessage('SIGNIN_TEST_ACCOUNT', 'SIGNIN_TEST_ACCOUNT', data);
}
export async function removeAccount(name: string) {
  return await sendMessage('REMOVE_ACCOUNT', 'REMOVE_ACCOUNT', name);
}
