import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('actors', {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    config: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('actors');
}

module.exports = {
  up,
  down,
};
