const TABLE_NAME = 'peripherals';
import { DataTypes } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable(TABLE_NAME, {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('heater'),
      allowNull: false,
    },
    communicationType: {
      type: DataTypes.ENUM('gpio'),
      allowNull: false,
    },
    gpio: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
