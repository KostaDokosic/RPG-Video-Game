import request from 'supertest';
import App from '../app/character.app';
import {
  CacheClient,
  createAndSigninTestAccount,
  Database,
} from '@zentrix/shared';
import Character from '../models/character.model';
import CharacterClass from '../models/character.class.model';
import Item from '../models/item.model';
import ItemCharacter from '../models/item-character.model';

describe('Character Tests', () => {
  const app = new App();
  let testAccount;
  const name = 'Tester';

  beforeAll(async () => {
    await Database.init('characters', 'character-svc-db', [
      Character,
      CharacterClass,
      Item,
      ItemCharacter,
    ]);
    await CacheClient.getInstance().startClient();
    testAccount = await createAndSigninTestAccount(name);
  });

  afterAll(async () => {
    await Database.disconnect();
    await CacheClient.getInstance().closeClient();
  });

  it('Get all characters', async () => {
    await createTestCharacter(name, testAccount.id);
    const response = await request(app.app)
      .get('/api/character')
      .set('Authorization', 'Bearer ' + testAccount.token);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.meta).toBeDefined();
    expect(response.body.data.length).toBeGreaterThan(0);

    await removeTestCharacter(name);
  });

  it('Get character by id', async () => {
    const testCharacter = await createTestCharacter(name, testAccount.id);
    const response = await request(app.app)
      .get('/api/character/' + testCharacter.id)
      .set('Authorization', 'Bearer ' + testAccount.token);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(testCharacter.name);
    expect(response.body.health).toBe(testCharacter.health);
    expect(response.body.baseAgility).toBe(testCharacter.baseAgility);
    expect(response.body.baseStrength).toBe(testCharacter.baseStrength);
    expect(response.body.baseIntelligence).toBe(testCharacter.baseIntelligence);
    expect(response.body.baseFaith).toBe(testCharacter.baseFaith);
    expect(response.body.items.length).toBe(0);
    expect(response.body.class).toBeDefined();
    expect(response.body.class.name).toBe(name);
    expect(response.body.stats).toBeDefined();

    await removeTestCharacter(name);
  });

  it('Create Character', async () => {
    const data = {
      name: 'Tester101',
      health: 100,
      mana: 100,
      baseStrength: 200,
      baseAgility: 150,
      baseIntelligence: 50,
      baseFaith: 25,
      class: {
        name: 'Tester101',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tempus lobortis diam faucibus scelerisque. Nunc vel augue ut lorem sagittis bibendum.',
      },
    };
    const response = await request(app.app)
      .post('/api/character')
      .send(data)
      .set('Authorization', 'Bearer ' + testAccount.token);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(data.name);
    expect(response.body.health).toBe(data.health);
    expect(response.body.baseAgility).toBe(data.baseAgility);
    expect(response.body.baseStrength).toBe(data.baseStrength);
    expect(response.body.baseIntelligence).toBe(data.baseIntelligence);
    expect(response.body.baseFaith).toBe(data.baseFaith);

    await removeTestCharacter('Tester101');
  });
});

async function createTestCharacter(name: string, createdBy: number) {
  await removeTestCharacter(name);
  const charClass = await CharacterClass.create({
    name,
    description: 'Lorem ipsum dolor santos',
  });
  return await Character.create({
    name,
    createdBy,
    classId: charClass.id,
  });
}

async function removeTestCharacter(name: string) {
  return await Promise.all([
    Character.destroy({ where: { name }, force: true }),
    CharacterClass.destroy({ where: { name }, force: true }),
  ]);
}
