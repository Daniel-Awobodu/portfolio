---
name: fpl-team-picker
description: Pick, rate and manage a Fantasy Premier League (FPL) team using the consensus strategy of the 20 most-viewed FPL YouTube videos of Apr-Oct 2026 (Let's Talk FPL, FPL Harry, FPL Focal, FPL Raptor, FPL Mate, Fantasy Football Hub with Ben Crellin and BigManBakar, Gianni Butticè, FPLtips), with every principle weighted by how many creators repeat it. Use this skill whenever the user mentions FPL, Fantasy Premier League, their FPL squad, a GW1 draft, gameweek transfers, who to captain, wildcard / free hit / bench boost / triple captain timing, differentials, "should I sell X", "rate my team", or wants help picking Premier League fantasy players, even if they never say "FPL" by name. Built for the classic budget game; for FPL Draft leagues only the player-quality principles apply.
---

# FPL Team Picker

This is the distilled consensus of the **20 most-viewed classic-FPL YouTube videos uploaded 17 Apr - 17 Oct 2026**: 8 channels, ~105k words of transcript, almost all of it 2026/27 GW1-6 content. Sources: `references/sources.md`. Full theme-by-video matrix: `references/consensus-tally.md`.

Every principle carries a weight, shown as **(videos / 20 · channels / 8)**. Channels count more than videos, because three videos from one creator are one opinion, not three.

- **Core**: ≥7 of 8 channels and ≥12 of 20 videos. Treat these as defaults and override them only for a specific, stated reason.
- **Strong**: ≥5 channels. Apply unless the user's situation clearly says otherwise.
- **Supporting**: 3-4 channels. Use as tie-breakers.

These are *methods*, not picks. Prices, injuries, penalty order, fixtures and even rules change every week, so get current facts before naming any player (Step 1).

## Step 1: Get the facts before advising

None of the creators decides without fresh information, so neither should you.

1. Establish the situation: the gameweek and deadline, the user's 15 players, money in the bank, free transfers (maximum 5 banked), chips left (two sets since 2025/26, one per half of the season), and the goal (mini-league or overall rank, and how much risk they want).
2. Pull live data if a tool allows it. The FPL API is public:
   - `https://fantasy.premierleague.com/api/bootstrap-static/` for players, prices, ownership, `news` and `chance_of_playing_next_round`
   - `/api/fixtures/` for fixtures
   - `/api/entry/{team_id}/event/{gw}/picks/` for a user's team

   Otherwise, web-search injuries, predicted line-ups, press-conference quotes, penalty takers, and bookmaker clean-sheet and goal odds. If neither is possible, ask the user and say clearly which facts you are assuming.
3. `references/season-2026-27-snapshot.md` records what the creators believed in Aug-Oct 2026. It is background only. Verify anything from it before you reuse it.

## Step 2: Core laws (apply roughly in this order)

### 1. Own the league's best defence (20/20 · 8/8)
This is the only point every video made. Hold 2-3 players (keeper and/or defenders) from the defence with the lowest xG conceded and the highest clean-sheet odds. The cheapest nailed route into that defence is the best value in the game; the 2026/27 example was a £4.4m centre-back starting for Arsenal. Fading it is what FPL Harry blamed for "one of the biggest red arrows I've had in quite a while". Choose *which* of its players by minutes certainty first, attacking upside second.

### 2. Plan on a 4-8 gameweek fixture horizon (19/20 · 8/8)
- Rate every pick on its next 4-6 fixtures. Plan in detail up to about 8 gameweeks; beyond that the plan "decays". Never buy for one fixture without checking the weeks after it, or you get "stuck" with the player.
- Use a fixture ticker or projections built on bookmaker clean-sheet % and projected goals, not team reputation.
- Target fixture swings and runs against the weakest teams: newly promoted sides, and defences that concede lots of big chances.
- Bench attackers who face the very best defence if you have a decent alternative.

### 3. Minutes before upside (18/20 · 8/8)
- Prefer nailed 90-minute starters. A slightly worse player who always plays beats a brilliant one in a rotation-heavy squad (2026/27: Man City under Maresca; "never trust Maresca roulette").
- Red flags: subbed around 60-70 minutes, competition for the position, a stop-gap playing out of position who loses the spot when injured teammates return, a short preseason, European football with a thin squad.
- Green flags: the only senior player in that role, a manager who clearly rates them (in one creator's words, "he's his guy"), penalties, no European football, averaging 85+ minutes.
- "If I'm not confident he'll start, then I won't pick him." If you do take a minutes risk, take one at a time, for a short window, with the exit already planned.

### 4. Captaincy decides your premiums (17/20 · 8/8)
- The captain scores double, so build the squad around who you will captain most often over the next 4-6 gameweeks. Own any premium who is the best captain in at least half of those weeks.
- The captain checklist, pieced together from several channels: a high ceiling, fit and in form, an in-form team, a **home** game, a **weak opponent**, **on penalties**, and ideally no midweek game.
- Fading the top premium is legitimate but high-variance. It needs (a) another premium you are happy to captain in those weeks and (b) a chip (Free Hit or Wildcard) to bring him in for his best fixture. Creators unsure of either just own him.
- When two captains are a coin toss, pick one, make the other vice-captain, and move on. It is fine to lean away from a team you already stack.

### 5. Routes to points (17/20 · 8/8)
Penalty, corner and free-kick takers who also collect bonus and DefCon points have a high floor and are "fixture-proof". Mid-priced set-and-forget midfielders who play 90 every week free your transfers for elsewhere. Re-check the penalty order whenever a team signs a player or the taker is subbed, and confirm it the next time the team actually wins a penalty. Having no penalties is a real negative for an expensive attacker.

### 6. Defensive contribution (DefCon) points (16/20 · 7/8)
Since 2025/26, players earn 2 points for reaching a threshold of defensive actions. In 2025/26 that was 10 clearances, blocks, interceptions and tackles for defenders, and 12 for midfielders including recoveries; check the current rules.
- Cheap (~£4.5-5.0m) centre-backs and holding midfielders with a high DefCon hit-rate are the best value in defence. DefCon is "more reliable than banking on a goal involvement from a full back".
- DefCon points survive a conceded goal, so DefCon defenders stay playable in poor fixtures.
- The best combination is DefCon plus aerial threat from set pieces.
- Check DefCon per 90 and the hit-rate (% of starts that reach the threshold). It needs full minutes.

### 7. Bench Boost early, then wildcard into a thin bench (14/20 · 8/8)
With two sets of chips, the dominant plan was a Bench Boost in GW1 or GW2. Among 100 surveyed experts, about 30% planned GW1 and 35% GW2. Use a bench of cheap players who start and have good fixtures, which means two playing keepers. Then wildcard into a normal squad with a £4.0m keeper and cheap bench spots.

The reasoning: an early BB needs no transfers to set up, while a mid-season BB forces you to gear transfers towards it and injuries can wreck it. Expect about 10-15 points from it and don't overthink it. A second-half BB is different: save it for a double gameweek.

### 8. Judge players on underlying numbers, not points (12/20 · 7/8)
Use xG, xGOT (quality of shots on target), xA, big chances, shots in the box, xG conceded and DefCon per 90.
- A player who blanked on 0.8 xG is a hold. A player who scored twice from 0.2 xG is a trap.
- A team keeping clean sheets while conceding lots of chances will regress.
- For new signings, use their output in their previous league, discounted.

## Step 3: Strong principles

- **Stack great fixtures (11/20 · 7/8).** Double or triple up on the team with the best run or the most in-form attack ("strike whilst the iron is hot"). Owning several of its attackers also covers the captaincy.
- **Defenders need attacking threat too (10/20 · 7/8).** Rank defenders on three things: clean-sheet odds, DefCon, and attacking threat (set-piece headers, shots, attacking full-backs or wing-backs on set pieces). A defender subbed after 60 minutes still keeps clean-sheet points.
- **Sketch a chip path, but hold it loosely (9/20 · 7/8).** Tie each chip to a fixture swing: Free Hit to dodge a clash or triple up on one great fixture, Wildcard into a swing or an international break. Most experts still refuse to lock in a wildcard week (76% kept it open). With two sets of chips, using 2-3 first-half chips by GW8 is normal when no doubles are expected.
- **Be patient with transfers (12/20 · 6/8).**
  - Roll the transfer if no move clearly improves the team over 4-6 gameweeks. Avoid hits, and avoid sideways one-week punts, especially the week before a wildcard.
  - Bank transfers (up to 5) to absorb injuries. Elite managers mostly make 0-1 transfers a week.
  - Fix problems first (injured, suspended, or no longer starting) before chasing "shiny new toys".
  - Counterweight: "the aim is the most points, not the most free transfers". When a move is clearly good, make it.
- **Decide without emotion (12/20 · 6/8).** Keep watching and deciding separate. Judge a player the same way whether or not you owned him when he blanked. Watch for club bias and recency bias ("who scored more points in the first two weeks?"). Stop tinkering once you've decided, ignore early-season rank, and "stick to the plan, variance is variance".
- **Wait for information (11/20 · 6/8).** Decide late in the week: after the previous gameweek's last match, the press conferences, and the midweek European line-ups (who was rested tells you about league minutes). Take manager quotes literally, and only lock in players you are sure of.
- **Template core, 1-2 calculated differentials (11/20 · 6/8).**
  - Own the highly owned players who are genuinely good value; expert ownership near or above 80% is a strong signal.
  - Differentiate in 1-2 spots with low-owned but *reliable* players. The best of these are owned by far more experts than overall, the "hidden gems".
  - A big gap between expert and overall ownership is a buy or sell signal.
  - Take risks early, then protect a good rank with robust picks. Count on other managers making mistakes rather than playing "hero ball".
- **Don't overreact (10/20 · 6/8).** Don't sell after one bad week or buy after one haul. After 2-3 gameweeks, weigh preseason and last-season evidence too.
- **European football costs minutes (10/20 · 6/8).** Thin squads playing Thursday-Sunday rotate and tire, so check how the midweek game went (a comfortable first-leg lead means rotation in the second leg). A player rested in Europe but first choice in the league is fine; FPL only needs league minutes.
- **Hunt pricing errors (9/20 · 6/8).** Players priced well below their role "pick themselves". They are usually cheap starters at top teams, or nailed strikers and penalty takers at mid-table clubs.
- **Keep the bench cheap (9/20 · 6/8).** Once the BB is used, spend the minimum on the second keeper, fifth defender and eighth attacker. Pick a £4.0m keeper from a team you won't triple up on, and one unlikely to drop in price. Still keep one reliable first sub.
- **Goalkeeper barbell (9/20 · 6/8, plus 8/20 · 5/8 on the £4.0m bench keeper).** Either buy the best defence's keeper as a set-and-forget pick (worth it only if you'll hold him for many weeks) or a £4.5m starter. Mid-priced keepers rarely justify the cost: the gap between the best keeper and the £5-5.5m keepers is bigger than the gap from those to a £4.5m.
- **Use price changes (9/20 · 5/8).** When a move is certain, make it before the price rises, because team value compounds. Avoid players likely to drop, such as £4.0m non-starters.
- **Wildcard proactively (8/20 · 5/8).**
  - Wildcard when several problems need fixing at once, or the structure is wrong for an upcoming fixture swing. Do it "from a position of strength", not after the team collapses.
  - International breaks are prime wildcard windows. Avoid wildcarding the week *before* one, because players get injured on international duty.
  - If next week's wildcard team would be almost identical, bringing it forward a week can save a transfer and team value.
- **Free Hit for one-week attacks (7/20 · 5/8).** Use it to triple up on a single fixture or dodge a bad week when you don't want those players long term. Wildcard if you do.
- **Keep routes open (7/20 · 5/8).**
  - Pick price points that allow one-move upgrades. It is easier to downgrade than to upgrade.
  - Leave a slot free for a team whose cheap entry might soon become nailed.
  - Own a key player before his big fixture rather than booking a transfer for it.
- **Every punt needs a planned exit (6/20 · 5/8).** Know which transfer or chip will replace a short-term pick before you buy him.
- **Core plus flexible spots (5/20 · 5/8).** Lock 10-11 "glue guys" you would hold for 10+ gameweeks, then compare 2-3 combinations for the remaining spots.

## Step 4: Supporting tie-breakers

- **Robust wildcard (7/20 · 4/8).** De-risk it and aim for zero planned transfers. Every player should be one you are happy to hold "until something goes wrong", so banked transfers can absorb injuries during international breaks.
- **Rotation pairs (6/20 · 4/8).** Pair cheap defenders or attackers whose fixtures alternate, so one always has a good game.
- **Triple Captain (6/20 · 4/8).** Use it the first week a premium ticks every captain box: fit, at home, a weak opponent, no midweek European game. It is the weakest, most luck-based chip, worth only the player's single score on top of a normal captaincy. Waiting for the "perfect" week risks injury.
- **Activate chips late (4/20 · 3/8).** Make the transfers during the week and activate the Wildcard or Free Hit just before the deadline, so you can still switch chips if news breaks. One elite manager missed the deadline, lost the wildcard and took a -64.
- **Three at the back (3/20 · 3/8).** Attackers outscore defenders, so 3-4-3 and 3-5-2 are the most common formations.

## Where the creators disagree

Present these as choices with trade-offs, matched to the user's appetite for risk. Don't invent a consensus.

| Question | One camp | Other camp |
|---|---|---|
| Fade the top premium (no-Haaland)? | Crellin (#1 all-time), BigManBakar, FPL Focal (GW1), FPLtips: spread the money, captain the other premium, use a chip for his best fixture | Let's Talk FPL, FPL Harry, FPL Raptor, 83% of 100 experts: "the safe play"; fading him books a chip and risks a huge red arrow |
| Goalkeepers | Rotate two £4.5m keepers with complementary fixtures; start the home keeper | One keeper you never bench plus a £4.0m; rotating "can go horribly wrong" and adds a weekly headache |
| Premium keeper? | Yes, as set-and-forget coverage of the best defence | No: the best keeper makes few saves, and the gap to a good £4.5m is only ~15-20 points a season |
| Defender type | DefCon centre-backs for a reliable floor | Attacking full-backs with set pieces for a higher ceiling |
| Steady set-piece midfielder vs explosive attacker | Take the 90-minute penalty and set-piece man (Raptor admits his bias against "steady Eddie" picks cost him) | Spend for open-play threat: big chances, shots in the box |
| Bench Boost week | GW1: everyone fit, no information needed | GW2: a better fixture for the cheap bench |
| Early wildcard (GW3-4) or hold to the international break | Go early: fix the structure, catch price rises, chase the swing | Hold: a bigger sample and more information, with transfers banked |
| Minutes risk on short-term picks | Fine if a wildcard is planned within ~3 gameweeks | Nailed picks give you "runway" to delay the wildcard |

## Workflows

### A. Build a fresh squad (GW1 or wildcard)
1. Fix the horizon: when is the next wildcard or Free Hit likely? That decides how long each pick must last.
2. Fill the core laws:
   - 2-3 players from the best defence
   - premium(s) chosen for captaincy
   - penalty and set-piece midfielders
   - DefCon defenders with set-piece threat
   - value forwards who are nailed
3. Check every player on minutes, the next 4-6 fixtures, penalties and set pieces, underlying numbers, and price trend.
4. Put the money in the starting XI. Keep the bench minimal unless a Bench Boost is imminent.
5. Stress-test it: set the line-up for each of the next 4-6 gameweeks (3-4-3 or 3-5-2). Check the first sub is reliable, there's a route to your next targets, and a wildcard needs no planned transfers.
6. Compare against expert ownership. Allow no more than 2 differentials, and only reliable ones.
7. Wait for team news, then lock in.

### B. Weekly deadline routine
1. After the last match, review calmly with no knee-jerk sales.
2. Fix real problems: injuries, suspensions, lost starting spots.
3. If nothing is broken, ask whether any move is *clearly* better over 4-6 gameweeks. If not, roll.
4. Pick the captain with the checklist in Core law 4.
5. Set the line-up: start nailed players, bench attackers facing the best defence, and start the home keeper of a rotating pair.
6. Watch price changes, wait for press conferences and midweek line-ups, and save the team well before the deadline.

### C. Rate a user's team
Score it against the core laws, and list the problems in order of impact. Propose at most 2 transfers (or a chip), each with the weighted principle behind it. Note anything you couldn't verify.

## Output format when advising

```
Recommendation: <one line: the move, captain, or chip>
Why: <2-4 bullets, each tied to a principle and its weight, e.g. "Minutes before upside (Core, 18/20)">
Risks / what would change my mind: <team news, a price change, a fixture>
Facts to verify: <anything not confirmed from live data>
```

Keep any player-specific claim tied to evidence: fixtures, minutes, set-piece roles, underlying numbers. FPL has high variance, so never present a pick as a sure thing.

## Rules the creators relied on (2025/26-2026/27; verify for the current season)
- Two sets of chips (Wildcard, Free Hit, Bench Boost, Triple Captain), one set per half of the season.
- Free transfers bank up to 5; "use them or lose them" at the cap.
- A clean sheet needs 60+ minutes, so a defender subbed after 60 keeps it.
- Midfielders score more for a goal than forwards and get 1 clean-sheet point. Goals beat assists for bonus.
- DefCon: 2 points for reaching the threshold.
- 2026/27 had no starting £4.0m keepers at launch, so £4.5m was the minimum for a playing keeper.
- Up to 20 transfers can be made before activating a Wildcard. Raptor also says wildcard transfers don't move prices.

## Caveats
- **The sample is early season.** These videos cover GW1-6. Double and blank gameweeks are barely discussed, so for second-half planning use general FPL knowledge and say that you are.
- **Sponsorship.** Most videos promote a tool (Fantasy Football Hub, Fantasy Football Scout, FotMob). Read "use tool X" as "use a projection model as a second opinion". Even the Hub's own guests said models never replace judgement.
- **The selection is view-ranked.** Ranking by views favours gameweek team-reveal videos from big channels, capped at 3 per channel. Generic strategy guides (chip guides, "10 tips") fell just outside the top 20. See `references/sources.md`.

## Refreshing the research
`scripts/fetch_fpl_transcripts.py` repeats the selection. It needs network access to youtube.com and `pip install yt-dlp`.

Run it from this skill's folder:

```
python3 scripts/fetch_fpl_transcripts.py transcripts --top 20 --months 6 --per-channel 3 --exclude <FPL-Draft video ids>
```

It writes `transcripts/transcripts/NN_<id>.txt` plus `videos.json`, `skipped.json` and `search_results.json` inside `transcripts/`, which is git-ignored. Re-read the transcripts, re-code the themes in `references/consensus-tally.md`, and update the weights here. The 2026-10 run excluded `q3eUzz5gYBk` (an FPL Draft league video).
