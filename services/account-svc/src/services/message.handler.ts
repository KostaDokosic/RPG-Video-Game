import { receiveMessage, Token } from '@zentrix/shared';
import Account from '../models/account.model';

export default function handleMessages() {
  receiveMessage('IS_AUTH', 'IS_AUTH', 'IS_AUTH', async function (id: number) {
    const account = await Account.findByPk(id, { attributes: ['id'] });
    return account ? true : false;
  });

  receiveMessage(
    'SIGNIN_TEST_ACCOUNT',
    'SIGNIN_TEST_ACCOUNT',
    'SIGNIN_TEST_ACCOUNT',
    async function (data: { name: string; password: string; role: string }) {
      await Account.destroy({ where: { name: data.name }, force: true });
      const account = await Account.create({ ...data });
      const token = await Token.create(account);

      return { ...account.data, token };
    }
  );

  receiveMessage(
    'REMOVE_ACCOUNT',
    'REMOVE_ACCOUNT',
    'REMOVE_ACCOUNT',
    async function (name: string) {
      return await Account.destroy({ where: { name }, force: true });
    }
  );
}
