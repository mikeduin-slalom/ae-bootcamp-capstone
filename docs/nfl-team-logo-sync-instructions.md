# Instructions to Sync NFL Team Logos from ESPN.com (currently used in separate application)

ESPN API: Syncing NFL Team Logos
Where the Logo URL Lives
When you hit the teams endpoint, each team object includes a logos array:


GET https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=1000
Response shape:


{
  "sports": [{
    "leagues": [{
      "teams": [{
        "team": {
          "id": "16",
          "abbreviation": "MIN",
          "name": "Vikings",
          "location": "Minnesota",
          "color": "4f2683",
          "alternateColor": "ffc62f",
          "logos": [
            { "href": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" }
          ]
        }
      }]
    }]
  }]
}
The logo URL is team.logos[0].href — a PNG hosted on ESPN's CDN.

What This App Does With It
Rather than hotlinking ESPN's CDN (which is fragile), it downloads each logo and re-uploads it to S3:


ESPN CDN → download image bytes → upload to S3 at logos/nfl/{abb}.png
The final stored URL is a self-hosted S3 URL: https://{bucket}.s3.{region}.amazonaws.com/logos/nfl/min.png

The DB row for each team gets a logo_url column pointing to that S3 path.

The Full Flow
GET /nfl/teams?limit=1000 → iterate sports[0].leagues[0].teams[]
For each team, grab team.logos[0].href
Download the image bytes from that ESPN URL
Upload to S3 at key logos/nfl/{abbreviation.toLowerCase()}.png
Update the team's DB row with the new S3 URL
500ms sleep between teams to avoid rate limiting
If You Don't Have S3
You can skip the re-hosting step and just store team.logos[0].href directly in your DB. ESPN's logo URLs are stable enough for most use cases — the S3 pipeline is just an extra reliability/branding layer this app added. For a side project pulling playoff rosters, hotlinking ESPN's CDN directly is fine.

Bonus: Team Colors
The same single API call also gives you team.color and team.alternateColor as hex strings (without the #), so you can grab team colors for free alongside logos.

