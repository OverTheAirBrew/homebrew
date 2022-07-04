import { DataTypes, QueryInterface } from 'sequelize';

async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.addColumn('kettles', 'targetTemperature', {
    type: DataTypes.INTEGER,
  });
}

async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.removeColumn('kettles', 'targetTemperature');
}

module.exports = {
  up,
  down,
};
