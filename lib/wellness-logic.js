export const AP_WEEKLY_PLANNING_LOGIC = `
AP WEEKLY WELLNESS PLAN - PLANNING LOGIC SPEC
Complete Decision Engine for Paige's App

FIXED WEEKLY CONSTANTS (never change):
- Gym schedule: Mon/Tue/Wed/Thu (strength), Friday (mobility 35-40 min), Sat/Sun off
- Morning smoothie: 1 cup frozen mixed berries, Coffee Mate French Vanilla creamer, Oikos Pro vanilla yogurt, 1/4 avocado, 5g Thorne creatine
- Pre-gym: half to full banana
- Supplements: Ritual multivitamin daily with smoothie, Spironolactone 100mg with lunch daily, Adderall 20mg at ~4:15am weekdays
- Protein shake: Oikos Salted Caramel at 3:30-4pm daily
- Sauna: 15 min after every gym session (reduce to 10 min if period is heavy)
- Cookies: Pillsbury cookies nightly if user selected dessert
- Skincare products are fixed: CeraVe Daily Moisturizing Lotion, Black Girl Sunscreen SPF 30, Cetaphil Daily Facial Cleanser, Azelaic acid (Mon/Wed/Fri evenings), Gua sha (Mon/Wed/Fri after moisturizer)

WORKOUT SPLIT (fixed structure, weights vary by cycle phase and feedback):
- Monday: Glutes + Hamstrings (hip thrusts, leg curl, clamshells, RDL)
- Tuesday: Arms + Shoulders (bicep curl, hammer curl, tricep pushdown, lateral raise)
- Wednesday: Back + Rear Delts (row, lat pulldown, cable row, rear delt fly, face pull)
- Thursday: Quads + Abs (BSS or goblet squat, plank, bicycle crunch, leg raise)
- Friday: Mobility (hip flexors, thoracic spine, hamstrings, shoulders, breathwork, 4-7-8 breathing)

WEIGHT PROGRESSION RULES:
- Follicular/Ovulatory phase: Full intensity, standard weights
- Luteal phase: Maintain or reduce compound lifts by 5 lbs, keep isolation same
- Menstrual phase (active period): 
  - Mild: Full intensity
  - Moderate: Compounds drop 5-10 lbs
  - Heavy: Compounds drop 10-15 lbs, max 2-3 exercises, sauna 10 min
- "Too easy" feedback: Increase compound lifts by 5 lbs next week
- "Too hard" feedback: Drop compound lifts by 5 lbs
- "About right": Maintain weights

CYCLE PHASES (calculate from last period start date):
- Days 1-5: Menstrual. Energy low, follow physical status adjustments
- Days 6-13: Follicular. Energy rising, train at full intensity
- Day 14: Ovulatory. Peak strength, push intensity
- Days 15-28: Luteal. Energy declining, keep sessions consistent but not max intensity
Phase note in skincare: 
- Follicular: Estrogen rising, skin clearing
- Ovulatory: Skin at best, azelaic acid as normal
- Luteal: Progesterone rising, potential breakouts, consider spot treatment
- Menstrual: Inflammation higher, stick to basics, no actives on heavy days

LUNCH OPTIONS (based on Q4 answer):
- Chicken thighs: Season with lemon, garlic, thyme, salt, pepper, olive oil. Roast 425F. Pair with selected veg + jasmine rice
- Steak (strip): Season simply, sear in cast iron. Pair with veg + rice
- Lamb chops: Season with rosemary, garlic, salt. Sear + oven finish. Pair with veg
- Pork chops: Brown sugar + smoked paprika rub. Pair with veg + rice
- Ground beef: Brown with onion and spices. Flexible pairing

DINNER OPTIONS (based on Q6 answer):
- Spaghetti with meat sauce: Paige's recipe, Ragu sauce + ground beef + thin spaghetti. Pair with Coke Mini or Sicilian lemon soda
- Pork chops + candy yams + rice: Glazed pork, canned or fresh yams
- Lamb + mashed potatoes + brussels sprouts: Roasted lamb, creamy mash
- Chicken pasta garlic butter: Chicken thigh pieces, pasta, garlic butter sauce
- Honey garlic wings + rice + broccoli: Baked wings with honey garlic glaze
- Pork chops + mashed potatoes + green beans: Classic comfort plate

GROCERY LIST RULES:
- Wegmans: Fresh proteins, produce, dairy
- Costco: Bulk items (frozen berries, rice, bulk protein)
- Amazon: Supplements (protein shakes, creatine)
- Remove from list any items user confirmed they already have at home
- If user is not going to a store, fold essential items to Wegmans or note "pick up next trip"

SKINCARE SCHEDULE:
Morning (every day): Lukewarm water rinse only, CeraVe moisturizer, Black Girl Sunscreen SPF 30
Post-gym (gym days only): Cetaphil cleanser within 15 min of sauna, CeraVe, reapply SPF if going outside
Evening (every night): Cetaphil cleanser, azelaic acid (Mon/Wed/Fri only), CeraVe moisturizer (wait 2-3 min after acid), Gua sha (Mon/Wed/Fri, after moisturizer, upward strokes)
During heavy period days: Skip azelaic acid entirely, basics only

SUNDAY PREP STRUCTURE:
- Total time: ~2-2.5 hours
- Equipment: Sheet pan, large skillet, large pot, rice cooker, 5 lunch containers, 5 dinner containers, zip bags
- Steps: Preheat oven, season protein, start rice, prep veg, cook dinner protein, cook pasta if applicable, portion all containers, cool and seal
- Portion: 5 lunch containers (1 protein + veg + rice each), 5 dinner containers, 5 smoothie bags (frozen berries)

MACRO TARGETS:
- Standard week: ~1,700-1,900 calories, 95-110g protein, 180-210g carbs, 55-65g fat
- Menstrual/low appetite: Allow down to 1,500 cal, keep protein above 80g
- High energy/post-period: Can push to 2,000 cal if appetite supports

OUTPUT REQUIREMENTS:
- Generate exactly 5 workout days (Mon-Thu strength + Fri mobility)
- Each strength day: minimum 4 exercises with specific weights, sets, reps, and coaching cues
- Meals: complete daily schedule from ~4:15am to evening
- Grocery list: organized by store, only items not already at home
- Prep: step by step with time estimates
- Write all content as if speaking directly to Paige in second person
`;
