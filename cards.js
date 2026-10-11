/* Scrapkin v2 — the two-deck burn test. THIS FILE IS THE CARD DATA: edit a card here,
   reload playtest.html, and it changes. Nothing is generated.

   A character:  t = its own material, r = recipe, brk = break value, m = its two moves.
   A move:
     n     name
     t     the material it needs under the character (for a burn move: the one it burns)
     d     printed damage
     burn  {material: how many} — burned off this character's own stack to fire the move
     calc  damage that reads the stack, overriding d:
             "perOwn:cloth"    1 for each Cloth under this character
             "big:cloth:4:2"   2 instead of d while this has 4 or more Cloth
             "low:2:3"         3 instead of d if this has 2 or fewer materials (after burning)
             "bigger:3"        3 instead of d if the target has more materials than this
     fx    the rider (see applyFx in playtest.html), with put/only for "put a material on"
     txt   exactly what the card says                                                    */
const C = {
  /* ------------------------------ CLOTH — Soft Goods ------------------------------ */
  "Patch": { t:"cloth", r:{cloth:2}, brk:1, seed:1,
    underTxt:"Draw a card whenever this character breaks an enemy character.",
    m:[ { n:"Snip", t:"cloth", d:1, txt:"1 damage." },
        { n:"Fray", t:"cloth", d:2, burn:{cloth:1}, txt:"Burn a Cloth. 2 damage." } ] },
  "Socky": { t:"cloth", r:{cloth:2}, brk:1, seed:1,
    m:[ { n:"Flop", t:"cloth", d:1, txt:"1 damage." },
        { n:"Stretch", t:"cloth", d:1, burn:{cloth:1}, fx:"two", txt:"Burn a Cloth. 1 damage to each of two different characters." } ] },
  "Sleepover": { t:"cloth", r:{cloth:2, wood:1}, brk:1,
    m:[ { n:"Tuck", t:"cloth", d:1, fx:"drawIfBreak", txt:"1 damage. Draw a card if this breaks a character." },
        { n:"Pillow Fight", t:"wood", d:1, burn:{wood:1}, calc:"perOwn:cloth", txt:"Burn the Wood. 1 damage for each Cloth under this character." } ] },
  "Mittens": { t:"cloth", r:{cloth:3, tin:1}, brk:1, grow:"cloth",
    m:[ { n:"Unspool", t:"cloth", d:1, fx:"draw1", txt:"1 damage. Draw a card." },
        { n:"Wind Tight", t:"tin", d:3, burn:{tin:1}, txt:"Burn the Tin. 3 damage." } ] },
  "Starry Pattern": { t:"cloth", r:{cloth:3, wood:1}, brk:1, grow:"cloth",
    m:[ { n:"Smother", t:"cloth", d:1, fx:"smother", txt:"1 damage. That character can't use a burn move on its next turn." },
        { n:"Blanket", t:"cloth", d:2, burn:{cloth:1}, calc:"bigger:3", txt:"Burn a Cloth. 2 damage. 3 instead if the target has more materials than this character." } ] },
  "Cotton Dragon": { t:"cloth", r:{cloth:4, wood:1}, brk:2,
    m:[ { n:"Billow", t:"cloth", d:1, calc:"big:cloth:4:2", txt:"1 damage. 2 instead while this has 4 or more Cloth." },
        { n:"Swaddle", t:"wood", d:0, burn:{wood:1}, fx:"putOnAlly", put:2, txt:"Burn the Wood. No damage. Put up to two materials from your hand onto characters you control." } ] },
  "Raggedy Angel": { t:"cloth", r:{cloth:4, tin:1}, brk:2, grow:"cloth",
    m:[ { n:"Layer", t:"cloth", d:1, fx:"putOnSelf", only:"cloth", txt:"1 damage. Put a Cloth from your hand onto this character." },
        { n:"Heavy Fold", t:"tin", d:1, burn:{tin:1}, calc:"perOwn:cloth", txt:"Burn the Tin. 1 damage for each Cloth under this character." } ] },
  "Hand-Me-Down": { t:"cloth", r:{cloth:3, wood:1}, brk:3, prize:1, growFrom:"Mittens",
    m:[ { n:"Mend", t:"cloth", d:1, fx:"putOnAlly", txt:"1 damage. Put a material from your hand onto a character you control." },
        { n:"Old Seams", t:"wood", d:2, burn:{wood:1}, fx:"two", txt:"Burn the Wood. 2 damage to each of two different characters." } ] },
  "Zipper": { t:"cloth", r:{cloth:3, tin:1}, brk:3, prize:1, growFrom:"Sleepover",
    m:[ { n:"Drift", t:"cloth", d:1, fx:"draw2", txt:"1 damage. Draw two cards." },
        { n:"Wish", t:"tin", d:2, burn:{tin:1}, fx:"extraPrize", txt:"Burn the Tin. 2 damage. If this breaks a character, take one extra prize." } ] },

  /* ------------------------------ CLAY — Kiln-Fired ------------------------------- */
  "Cuppy": { t:"clay", r:{clay:2}, brk:1, seed:1,
    underTxt:"If a material is destroyed here, add a Clay from your hand at the start of your next turn.",
    m:[ { n:"Nip", t:"clay", d:1, txt:"1 damage." },
        { n:"Chip", t:"clay", d:2, burn:{clay:1}, txt:"Burn a Clay. 2 damage." } ] },
  "Glob": { t:"clay", r:{clay:2}, brk:1, seed:1,
    m:[ { n:"Crumble", t:"clay", d:1, txt:"1 damage." },
        { n:"Splat", t:"clay", d:1, burn:{clay:1}, fx:"two", txt:"Burn a Clay. 1 damage to each of two different characters." } ] },
  "Raku": { t:"clay", r:{clay:2, glass:1}, brk:1,
    m:[ { n:"Dent", t:"clay", d:1, fx:"toolFirst", txt:"1 damage. If that character has a Tool, destroy the Tool instead." },
        { n:"Sharp Edge", t:"glass", d:3, burn:{glass:1}, fx:"drawIfLastOwn", txt:"Burn the Glass. 3 damage. Draw a card if this destroys their last own-type material." } ] },
  "Rune-Dog": { t:"clay", r:{clay:3, plastic:1}, brk:1,
    m:[ { n:"Mark", t:"clay", d:1, fx:"mark", txt:"1 damage. The next attack against that character this turn deals 1 more." },
        { n:"Guard", t:"plastic", d:0, burn:{plastic:1}, fx:"bearWeight", txt:"Burn the Plastic. No damage. Until your next turn, the first attack against each other character you control deals no damage." } ] },
  "Hot Cup": { t:"clay", r:{clay:3, glass:1}, brk:1, grow:"clay",
    m:[ { n:"Glaze", t:"glass", d:1, fx:"putOnSelf", txt:"1 damage. Put a material from your hand onto this character." },
        { n:"Boil Over", t:"clay", d:3, burn:{clay:1}, calc:"low:2:4", txt:"Burn a Clay. 3 damage. 4 instead if this character then has 2 or fewer materials." } ] },
  "Crackle": { t:"clay", r:{clay:3, plastic:1}, brk:1, grow:"clay",
    m:[ { n:"Chime", t:"clay", d:1, fx:"draw1", txt:"1 damage. Draw a card." },
        { n:"Crack", t:"clay", d:1, burn:{clay:1}, fx:"all", txt:"Burn a Clay. 1 damage to every enemy character." } ] },
  "Glimmer": { t:"clay", r:{clay:4, plastic:1}, brk:2, grow:"clay",
    m:[ { n:"Bake", t:"clay", d:1, calc:"big:clay:4:2", txt:"1 damage. 2 instead while this has 4 or more Clay." },
        { n:"Kiln Blast", t:"clay", d:5, burn:{clay:2}, txt:"Burn two Clay. 5 damage." } ] },
  "Gilded Dog": { t:"clay", r:{clay:3, glass:1}, brk:3, prize:1, growFrom:"Rune-Dog",
    m:[ { n:"Stand Guard", t:"clay", d:1, fx:"seal", txt:"1 damage. Until your next turn, you choose what gets destroyed on this character." },
        { n:"Gilt Bite", t:"glass", d:3, burn:{glass:1}, txt:"Burn the Glass. 3 damage." } ] },
  "Slipglaze": { t:"clay", r:{clay:3, plastic:1}, brk:3, prize:1, growFrom:"Hot Cup",
    m:[ { n:"Seal", t:"clay", d:1, fx:"putOnAlly", txt:"1 damage. Put a material from your hand onto a character you control." },
        { n:"Vitrify", t:"plastic", d:2, burn:{plastic:1}, fx:"extraPrize", txt:"Burn the Plastic. 2 damage. If this breaks a character, take one extra prize." } ] },
};

/* Items are unchanged from the current game. */
const ITEM = {
  "Thimble":      { tool:1, cost:"a move", text:"Blocks the first attack against this character each turn — one attack, not one damage." },
  "Lacquer":      { tool:1, cost:"a move", text:"The attacker can't choose what to destroy here. You choose." },
  "Sentry Bell":  { tool:1, cost:"a move", text:"Enemy characters must attack this one." },
  "Music Box":    { tool:1, cost:"a move", text:"When a material is destroyed here, draw a card." },
  "Spare Button": { tool:1, cost:"a move", text:"When this character breaks, its break value is 1." },
  "Rummage":      { cost:"a move", text:"Draw two." },
  "Beach Ball":   { prize:1, cost:"a move", text:"Take three materials of any one type from your material deck." },
  "Lock":         { prize:1, cost:"a move", text:"Return a character from your discard pile to your hand." },
};
const ITEMS6 = ["Thimble","Lacquer","Sentry Bell","Music Box","Spare Button","Rummage"];

/* Each deck uses three materials only: its own and two partners. Neither deck's partner
   is shrugged off by the other deck's characters, so immunity stays out of this matchup. */
const DECKS = {
  cloth: { name:"Soft Goods", focus:"cloth",
    blurb:"Cloth. Patches itself up and hits harder the more Cloth it keeps.",
    main:["Patch","Socky","Sleepover","Mittens","Starry Pattern","Cotton Dragon","Raggedy Angel"],
    mats:{ cloth:20, wood:8, tin:8 },
    prize:["Hand-Me-Down","Zipper","Hand-Me-Down","Zipper","Beach Ball","Lock"] },
  clay: { name:"Kiln-Fired", focus:"clay",
    blurb:"Clay. Burns up its own Clay for the biggest hits in the game.",
    main:["Cuppy","Glob","Raku","Rune-Dog","Hot Cup","Crackle","Glimmer"],
    mats:{ clay:20, glass:8, plastic:8 },
    prize:["Gilded Dog","Slipglaze","Gilded Dog","Slipglaze","Beach Ball","Lock"] },
};
const COPIES = { char:3, item:2 };
