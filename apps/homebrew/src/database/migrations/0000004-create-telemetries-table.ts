import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('telemetries', {
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
  await queryInterface.dropTable('telemetries');
}

module.exports = {
  up,
  down,
};
