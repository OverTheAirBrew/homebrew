import { DataTypes, QueryInterface } from 'sequelize';

async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.addColumn('kettles', 'logicRun_id', {
    type: DataTypes.UUID,
  });
}

async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.removeColumn('kettles', 'logicRun_id');
}

module.exports = {
  up,
  down,
};
