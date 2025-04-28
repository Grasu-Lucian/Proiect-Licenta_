const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Ticket = require('./ticketModel');

const Reply = sequelize.define('Reply', {
  ReplyID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FKTicketID: {
    type: DataTypes.INTEGER,
    allowNull: false, // A reply must be associated with a ticket
    references: {
      model: Ticket,
      key: 'TicketID',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false, // Username is required
  },
  ReplyText: {
    type: DataTypes.TEXT,
    allowNull: false, // The reply content is required
  },
}, {
  tableName: 'Replies',
  timestamps: true,
});

// Define relationships
Ticket.hasMany(Reply, { foreignKey: 'FKTicketID' });
Reply.belongsTo(Ticket, { foreignKey: 'FKTicketID' });

module.exports = Reply;