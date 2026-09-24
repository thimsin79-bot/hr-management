const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = async (req, res) => {
  const html = readFileSync(join(__dirname, 'hr-management.html'), 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).send(html);
};