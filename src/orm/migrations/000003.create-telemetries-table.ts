import { DataTypes } from 'sequelize';

const TABLE_NAME = 'telemetries';

async function up({ context: queryInterface }) {
  await queryInterface.createTable(TABLE_NAME, {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sensor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'sensors', key: 'id' },
    },
    reading: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
  await queryInterface.dropTable(TABLE_NAME);
}

module.exports = {
  up,
  down,
};
