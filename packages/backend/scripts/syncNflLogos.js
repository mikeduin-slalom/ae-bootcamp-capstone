const https = require('https');
const fs = require('fs');
const path = require('path');
const nflTeamsStore = require('../src/services/nflTeamsStore');

const ESPN_API_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=1000';
const LOGOS_DIR = path.join(__dirname, '..', '..', 'frontend', 'public', 'logos', 'nfl');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, res => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', err => { fs.unlink(destPath, () => {}); reject(err); });
    }).on('error', err => { fs.unlink(destPath, () => {}); reject(err); });
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!fs.existsSync(LOGOS_DIR)) {
    console.error(`Error: logos directory not found: ${LOGOS_DIR}`);
    process.exit(1);
  }

  console.log('Syncing NFL team logos...');

  const apiData = await fetchJson(ESPN_API_URL);
  const teams = apiData.sports[0].leagues[0].teams.map(entry => entry.team);

  let succeeded = 0;
  let failed = 0;
  const failedTeams = [];

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const abbr = team.abbreviation.toLowerCase();
    const logoUrl = team.logos && team.logos[0] && team.logos[0].href;
    const logoPath = `/logos/nfl/${abbr}.png`;
    const destPath = path.join(LOGOS_DIR, `${abbr}.png`);

    process.stdout.write(`[${i + 1}/${teams.length}] ${team.abbreviation} ${team.location} ${team.name} — `);

    try {
      if (!logoUrl) throw new Error('no logo URL in API response');

      await downloadFile(logoUrl, destPath);

      nflTeamsStore.upsertTeam({
        espnTeamId: team.id,
        name: team.name,
        location: team.location,
        abbreviation: team.abbreviation,
        color: team.color || null,
        alternateColor: team.alternateColor || null,
        logoPath,
      });

      console.log('downloaded ✓');
      succeeded++;
    } catch (err) {
      console.log(`failed: ${err.message}`);
      failed++;
      failedTeams.push(team.abbreviation);
    }

    if (i < teams.length - 1) {
      await delay(500);
    }
  }

  console.log(`\nSync complete: ${succeeded} succeeded, ${failed} failed.`);
  if (failedTeams.length > 0) {
    console.log(`Failed teams: ${failedTeams.join(', ')}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
