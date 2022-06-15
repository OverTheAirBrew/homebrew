import { DataTypes, QueryInterface } from 'sequelize';

async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.createTable('kettles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    sensor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'sensors', key: 'id' },
    },
    heater_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'actors', key: 'id' },
    },
    logicType_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    config: {
      type: DataTypes.JSON,
      allowNull: true,
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
  await queryInterface.dropTable('kettles');
}

module.exports = {
  up,
  down,
};
