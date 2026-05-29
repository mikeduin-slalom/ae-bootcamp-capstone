const { auditEntries } = require('./dataStore');

function recordAuditEvent(event, context = {}) {
  const entry = {
    event,
    context,
    timestamp: new Date().toISOString()
  };

  auditEntries.push(entry);

  if (auditEntries.length > 200) {
    auditEntries.shift();
  }

  console.info('[audit]', JSON.stringify(entry));

  return entry;
}

function getRecentAuditEvents() {
  return [...auditEntries];
}

module.exports = {
  recordAuditEvent,
  getRecentAuditEvents
};
