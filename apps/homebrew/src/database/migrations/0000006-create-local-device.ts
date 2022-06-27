import { QueryInterface } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { Device } from '../models/device';

async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.insert(new Device(), 'devices', {
    id: uuid(),
    name: 'localhost',
    type_id: 'local-device',
    config: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.delete(new Device(), 'devices', {
    name: 'localhost',
  });
}

module.exports = {
  up,
  down,
};
