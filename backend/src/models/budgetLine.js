const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("BudgetLine", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    lineNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    annualAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    q1Amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    q2Amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    q3Amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    q4Amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    costCenter: DataTypes.STRING,
    departmentName: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    hooks: {
      async afterCreate(instance) {
        await recalculateBudgetTotal(sequelize, instance.budgetId);
      },
      async afterUpdate(instance) {
        await recalculateBudgetTotal(sequelize, instance.budgetId);
      },
      async afterDestroy(instance) {
        await recalculateBudgetTotal(sequelize, instance.budgetId);
      }
    }
  });

async function recalculateBudgetTotal(sequelize, budgetId) {
  if (!budgetId) return;
  const { Budget, BudgetLine } = sequelize.models;
  if (!Budget || !BudgetLine) return;

  const lines = await BudgetLine.findAll({ where: { budgetId }, attributes: ["annualAmount"] });
  const total = lines.reduce((sum, line) => sum + Number.parseFloat(line.annualAmount || 0), 0);
  await Budget.update({ totalAmount: Number(total.toFixed(2)) }, { where: { id: budgetId } });
}
