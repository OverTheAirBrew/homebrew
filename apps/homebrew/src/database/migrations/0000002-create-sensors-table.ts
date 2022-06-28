import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('sensors', {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.UUID,
      references: { model: 'devices', key: 'id' },
      allowNull: false,
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
  await queryInterface.dropTable('sensors');
}

module.exports = {
  up,
  down,
};
