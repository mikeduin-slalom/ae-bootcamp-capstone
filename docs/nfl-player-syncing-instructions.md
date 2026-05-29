# Question Asked to Another Applcation where NFL Player Syncing is Active

In a completely separate application, I am trying to pull a list of NFL players from teams that made the playoffs. We have player-syncing functionality wired up in this application for our NFL TD Survivor Pool. Can you give me a rundown of how I should instruct that application to sync players via the ESPN API?

# Response from AI Agent

ESPN API: Syncing Players from Playoff Teams
Step 1 — Identify Playoff Team IDs
This app doesn't filter to playoff teams — it loops all 32. For your use case, you'll need to derive the playoff team list first. ESPN exposes this via the postseason scoreboard:


GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=3&week=1
seasontype=3 = postseason, seasontype=2 = regular season. Pull weeks 1–4 (Wild Card through Super Bowl) and collect all unique team.id values from the competitions[].competitors[] arrays. That gives you your 12-14 playoff team IDs.

Step 2 — Fetch Roster + Depth Chart per Team
For each playoff team ID, hit two endpoints in parallel:


# Offense-only depth chart (items[2] = offense, items[0] = defense, items[1] = ST)
GET https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/{year}/teams/{teamId}/depthcharts

# Full roster with headshots and display names
GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/{teamId}/roster
The depth chart gives you rank + ESPN athlete ID (extracted from the athlete.$ref URL via regex athletes\/(\d+)). The roster gives you the player details. You join them on player.id === playerId.

Step 3 — Extract Offensive Skill Positions
This app filters to QB/RB/WR/TE from the depth chart offense block:


const depthChartOffense = depthChart.data.items[2];
const positions = ['qb', 'rb', 'wr', 'te'];
// Each position: depthChartOffense.positions[pos].athletes → [{ rank, athlete: { $ref } }]
Step 4 — Rate Limit Between Team Requests
ESPN will throttle you. This app uses a 1-second sleep between each team request — keep that in your loop.

Key Data Shape You Get Back
From the depth chart + roster join, each player looks like:


{
  playerId: "3054211",       // ESPN athlete ID (from $ref regex)
  shortName: "J. Jefferson",
  displayName: "Justin Jefferson",
  headshot: "https://a.espncdn.com/...",
  teamAbb: "MIN",
  teamId: "16",              // ESPN team ID
  position: "WR",
  depthRank: 1,
  season: 2025
}
Summary Flow for Your App
GET scoreboard?seasontype=3&week=1 through week=4 → collect unique playoff team.ids
For each playoff team ID: GET /depthcharts + GET /roster → join on athlete ID
Filter to items[2] (offense) → positions qb, rb, wr, te
Sleep 1s between teams
Insert/upsert players into your DB with player_id_espn as the unique key
The hardest part is the $ref join — the depth chart gives you ESPN athlete IDs as URLs, not raw integers, so you need the regex athletes\/(\d+) to extract the ID before you can match against the roster data.

# NFL Playoff Teams for 2025

American Football Conference (AFC)
Denver Broncos (Bye, AFC West Champion)
New England Patriots (AFC East Champion)
Jacksonville Jaguars (AFC South Champion)
Pittsburgh Steelers (AFC North Champion)
Houston Texans (Wild Card)
Buffalo Bills (Wild Card)
Los Angeles Chargers (Wild Card)
National Football Conference (NFC)
Seattle Seahawks (Bye, NFC West Champion - Super Bowl LX Champion)
Chicago Bears (NFC North Champion)
Philadelphia Eagles (NFC East Champion)
Carolina Panthers (NFC South Champion)
Los Angeles Rams (Wild Card)
San Francisco 49ers (Wild Card)
Green Bay Packers (Wild Card)

