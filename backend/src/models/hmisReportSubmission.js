const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define("HmisReportSubmission", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    submissionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    reportCode: {
      type: DataTypes.ENUM("HMIS105", "HMIS108", "HMIS033A", "HMIS033B", "HMIS106", "HMIS107", "IDSR"),
      allowNull: false
    },
    reportName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reportingFrequency: {
      type: DataTypes.ENUM("Daily", "Weekly", "Monthly", "Quarterly", "Annual", "AdHoc"),
      allowNull: false
    },
    reportingPeriodStart: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reportingPeriodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    facilityCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: DataTypes.STRING,
    expectedSubmissionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    submittedAt: DataTypes.DATE,
    timelinessStatus: {
      type: DataTypes.ENUM("Pending", "OnTime", "Late"),
      defaultValue: "Pending"
    },
    completenessPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    accuracyStatus: {
      type: DataTypes.ENUM("Unverified", "Verified", "Rejected"),
      defaultValue: "Unverified"
    },
    submissionChannel: {
      type: DataTypes.ENUM("Paper", "DHIS2", "EMRS", "Hybrid"),
      defaultValue: "EMRS"
    },
    payloadJson: DataTypes.TEXT
  });
