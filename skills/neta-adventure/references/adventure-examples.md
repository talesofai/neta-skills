# Adventure Campaign Examples

Complete worked examples demonstrating all fields for different genres. Use these as reference for what exceptional campaigns look like — not templates to copy, but benchmarks to match.

---

## Example 1: Survival Horror — Raccoon General Hospital

**Genre**: Survival horror / conspiracy thriller
**Tone**: Dread and implication over explicit gore; Resident Evil-inspired

```
name: "Raccoon General: Final Shift"

subtitle: "The quarantine started three weeks ago. No one told you it was still going."

status: PUBLISHED

header_img: https://oss.talesofai.cn/picture/b3ff97bf-2c8a-42fd-b0ab-bcca9a7c120f.webp

mission_plot: |
  The last maintenance log entry is dated three weeks ago. The terminal in the
  security booth still works. The lights in the main corridor still work.
  The bodies in Lab C suggest neither was enough.

  You are a contract security guard who showed up for a routine overnight shift at
  Raccoon General Hospital — and found the parking lot empty, the front desk
  abandoned, and the fire doors on every floor sealed from the inside. Your radio
  connects to one frequency: static interrupted, every few minutes, by what might
  be a voice.

  Dr. Helena Strauss ran the hospital's experimental pharmacology division on the
  third floor. Three weeks ago, she filed an internal incident report that no one
  in administration acknowledges receiving. Two weeks ago, she left a voicemail
  for the city health department that no one returned. Last week, the voicemails
  stopped. Her lab is still locked. Her keycard is still in the system as active.

  The hospital was designed for 300 patients. According to the intake logs, 312
  checked in during the quarantine window. None checked out. The current patient
  census on the administrative system reads: 0.

  Something moves on the floor above you. It walks on two legs. It doesn't
  walk like a person.

mission_task: |
  Survive the night and find a way out of the hospital.
  Secondary objectives (any you complete will be remembered):
  - Find Dr. Strauss's incident report and understand what she discovered
  - Reach the roof communications array and broadcast an emergency signal
  - Determine what Umbrella Pharmaceuticals' role was in the quarantine decision
  The hospital has four floors, a basement, and a rooftop access. You have
  a flashlight, a security keycard (level 1 access), and a radio with one
  functioning channel.

mission_plot_attention: |
  TONE: Maintain survival-horror dread at all times. Horror is conveyed through
  implication, environmental detail, and what is NOT explained — not through
  explicit gore or jump scares. The moment the player stops feeling unsafe is the
  moment tension has been lost.

  DR. STRAUSS: She is alive. She is hiding. She knows what happened. She will not
  immediately trust the player — she has seen what people do under stress in this
  hospital. She speaks in clipped, clinical sentences. She does not comfort the
  player. She trades information for usefulness.

  INFORMATION GATING: The player must earn every revelation. Dr. Strauss does not
  volunteer the full truth. The incident report is in pieces. Umbrella's role is
  inferrable from documents found across multiple floors, not from a single
  exposition dump.

  THE INFECTED: They were patients and staff. They retain fragments of who they
  were — a nurse still clutches a clipboard, a doctor still wears his ID badge.
  This should be disturbing, not just dangerous. The player should occasionally
  recognize someone.

  CONTENT LIMITS: No sexual content. Violence is present but clinical — describe
  aftermath and implication, not the act itself. The horror is existential and
  conspiratorial, not slasher.
```

**Why this works**:
- Opening doesn't introduce the player — it drops them into an already-wrong situation
- `subtitle` is a hook question that creates immediate dread
- `mission_plot_attention` covers tone, named NPC behavior, information structure, and content limits
- `mission_task` has clear primary + secondary objectives with real stakes but no predetermined path

---

## Example 2: Sci-Fi Mystery — The Cartographer's Signal

**Genre**: Sci-fi exploration / mystery
**Tone**: Isolated, contemplative; solarpunk-adjacent

```
name: "The Cartographer's Signal"

subtitle: "You are the first human to reach this station. The logs suggest you are not."

status: PUBLISHED

mission_plot: |
  The survey station Meridian-7 was placed in high orbit above the gas giant
  Calleis eighteen months ago. Fully automated. No crew assigned. Its job: map
  the planet's atmospheric composition and relay data back to the Cartographers'
  Guild on Kepler Station.

  Six weeks ago, Meridian-7 began transmitting something else alongside its
  atmospheric data. Not interference. Not corruption. A pattern — repeating,
  structured, embedded in the data stream like a signature. The Guild dispatched
  you, their senior analyst, to investigate. Standard procedure: board, diagnose,
  report.

  You docked forty minutes ago. The station is operational. Every system nominal.
  The atmospheric mapping data is accurate and undisturbed.

  The logs show that someone has been living here for the past six weeks. The
  environmental systems show continuous life support usage. The food synthesizer
  has been used 127 times.

  The station is currently empty. The airlock records show no departures.

  The pattern in the data stream, when rendered as a visual, looks like a face.

mission_task: |
  Determine the source of the pattern embedded in Meridian-7's data stream.
  Document your findings for the Guild — they need to know if this is a technical
  anomaly, a prank, or something else.
  Understand what happened to whoever was living here.
  Decide what to report, and to whom.

mission_plot_attention: |
  TONE: Contemplative unease, not horror. The station is beautiful and the
  planet below is magnificent. The wrongness is intellectual — the math doesn't
  add up, the logs contradict themselves, the pattern defies explanation. This
  should feel like a puzzle with existential stakes, not a haunted house.

  THE ABSENCE: Whatever was here is gone. There are no jump scares, no threats,
  no danger (at first). The horror is entirely in the implication of what the
  logs record and what the station's physical state suggests.

  INFORMATION PACING: Each discovery should complicate the picture, not clarify
  it. The player should be confident they understand what happened at some point
  midway through — and then discover they were wrong.

  THE GUILD: They have their own interests. Not all of them are benign. The
  player may eventually realize that "report everything to the Guild" is not
  necessarily the right choice.

  CONTENT LIMITS: No violence (nothing to be violent toward, initially). If
  violence becomes possible later in the story, it should feel like a rupture,
  not a genre expectation.
```

---

## Example 3: Fantasy Political Intrigue — The Last Council

**Genre**: Political intrigue / moral horror
**Tone**: Court drama; no clear villains, only competing necessities

```
name: "The Last Council"

subtitle: "The kingdom has one week before the treaty expires. You are the only person all three factions will speak to."

status: PUBLISHED

mission_plot: |
  The War of Succession ended eleven years ago. The Peace of Aldenmere was
  supposed to hold for a generation. It expires in seven days.

  Three factions now control what was once a unified kingdom: the Merchant
  Compact of the coastal cities (wealth, no military), the Highland Clans
  (military, no wealth), and the Temple of the Unbroken Flame (legitimacy,
  neither wealth nor army — but the only institution all three sides treat as
  neutral). You are the Temple's senior diplomat, sent to negotiate a renewal
  of the peace.

  What you know: the Compact has been secretly arming the Clans' rivals to the
  north. The Clan chief's heir was killed in what was officially ruled an
  accident — three witnesses recanted their testimonies last month. The Temple's
  own records contain a document that, if made public, would destroy the
  Compact's claim to the coastal cities entirely.

  What you don't know: why the Compact is arming the north. What the heir
  actually discovered before he died. What the Temple's high council really
  wants you to accomplish — and whether "peace" is actually their goal.

  The first negotiation session begins tomorrow. All three faction leaders are
  already in the city. Two of them have already sent you private messages asking
  to meet before the session.

mission_task: |
  Negotiate a renewed peace treaty before the seven-day deadline.
  The treaty must be signed by representatives of all three factions to be valid.
  What "peace" looks like, and what it costs, is up to you.
  Secondary objectives: understand what actually happened to the heir; determine
  what the Temple's high council is concealing and why.

mission_plot_attention: |
  NO CLEAR VILLAINS: Every faction leader has legitimate grievances and
  understandable motivations. The Compact's arms sales may be protection against
  a genuine northern threat. The Clans' anger about the heir may be righteous
  or paranoid — possibly both. The Temple may be protecting something genuinely
  sacred or something genuinely corrupt.

  INFORMATION ASYMMETRY: The player always knows more than any single NPC, but
  less than all of them combined. The truth requires synthesizing information
  from sources that each distrust and withhold from the others.

  POLITICAL DIALOGUE: Faction leaders speak carefully. No one says what they
  mean directly. Agreements are plausible deniable. Threats are phrased as
  observations.

  MORAL WEIGHT: There is no solution that satisfies everyone. Peace may require
  covering up the heir's murder. Justice may require destroying the peace.
  Do not resolve this tension for the player — let them sit in it.

  CONTENT LIMITS: Political violence is possible and consequential. No sexual
  content. Moral complexity is the primary source of tension, not physical danger.
```

---

## Example 4: Wuxia Political Thriller — The Wulin Inquisition

**Genre**: Wuxia / political mystery
**Tone**: Honor, grief, and institutional corruption; the weight of being the only person who knows the truth

```
name: "The Wulin Inquisition"

subtitle: "Your sect was destroyed three days ago. The edict ordering its dissolution arrived six days ago."

status: PUBLISHED

mission_plot: |
  The Iron Cloud Sect has stood for two hundred years. As of three days ago,
  it no longer exists.

  You are its sole surviving disciple — you survived because you were not there.
  Six months ago, your Shifu sent you to the capital on a correspondence errand
  she assigned with unusual urgency, unusual care in the wording, and an unusual
  insistence that you leave before dawn. The capital is three days' ride from
  the sect. The Imperial Edict dissolving the Iron Cloud was issued six days ago.

  Your Shifu knew. She sent you away before the edict arrived.

  The official record states that the Iron Cloud Sect was disbanded following
  evidence of collaboration with northern rebels. The evidence was presented by
  Grand Arbiter Shen Mingzhi — the man your Shifu once refused to marry.
  The man who, according to the correspondence you were carrying, was about to be
  indicted for corruption by the Three Courts review.

  You arrived in the capital carrying letters that no longer have a recipient.
  The correspondence pouch is sealed with Iron Cloud wax.
  In the capital, that seal is now a crime.

mission_task: |
  Discover whether the corruption indictment against Grand Arbiter Shen still
  exists — and in whose hands.
  Determine what actually happened to your Shifu and the other disciples.
  Decide what to do with what you find: expose it, use it, or bury it.
  Secondary: understand why your Shifu sent you away six months in advance —
  she knew something was coming long before the edict.

mission_plot_attention: |
  POWER IMBALANCE: The player is a junior disciple, alone, in a city where
  carrying their sect's seal is a criminal act. They have no political standing,
  no allies, and no martial reputation. Let them feel this weight before they
  earn any leverage. Competence must be demonstrated, not assumed.

  GRAND ARBITER SHEN: He is not simply a villain. He is intelligent, politically
  dangerous, and genuinely believes he was protecting the empire from a sect he
  considered a long-term threat. His grievance against the Iron Cloud is real,
  even if his methods were not. He should not be easy to outmaneuver, and he
  should not be cartoonishly evil — he is a man who made a calculation.

  INFORMATION STRUCTURE: The full truth requires assembling pieces from three
  separate power centers: the Imperial Court, the Wulin martial community,
  and the criminal underground that moves between them. No single source has
  the complete picture. Evidence appears in fragments. The corruption indictment
  documents are not in one place.

  THE SHIFU: Her fate is unknown. Do not confirm or deny her survival until the
  player has earned that information through investigation. What she knew — and
  when she knew it — is the deepest layer of the mystery.

  TONE: Wuxia political thriller. Honor, sacrifice, and the weight of legacy.
  Martial arts skill matters but is never the only path — political acuity,
  patience, and knowing who to trust are equally important. Violence is present
  and consequential; it should never feel like the obvious solution.

  CONTENT LIMITS: No sexual content. Martial combat and political violence are
  present but not gratuitous. The emotional core is loyalty, grief, and justice —
  not action spectacle.
```

**Why this works**:
- Opening establishes the player's vulnerability immediately — no power fantasy, no chosen-one framing
- The six-month timeline gap (Shifu knew) creates layered mystery: the corruption case *and* the deeper question of what the Shifu saw coming
- Grand Arbiter Shen is designed to resist easy vilification — the moral complexity is structural
- `mission_plot_attention` names the power imbalance explicitly so the agent doesn't accidentally let the player steamroll a senior official in scene 2
- The three-source information structure (Court, Wulin, underground) gives the agent a framework for pacing revelations across multiple sessions
