'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(93,66,51,0.03)', marginBottom: '14px' };
var cardTitle = { fontFamily: sans, fontSize: '15px', fontWeight: 600, color: brown, marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(93,66,51,0.06)' };

var WEEK = {
  title: 'Week of June 1-5',
  phase: 'Follicular · Days 4-8 · New split begins',
  overview: 'Period ended May 28. Estrogen rising, energy returning. First full week on restructured split. Train at full effort.',
  workouts: [
    { day: 'Mon', label: 'Glutes + Hamstrings · Heavy', focus: 'Hip thrusts, leg curl, clamshells',
      exercises: [
        { name: 'Barbell hip thrust', muscle: 'glutes', weight: '85 lbs', sets: '4 x 10-12', cue: 'Shins vertical at top. Posterior pelvic tilt. 2-sec squeeze.' },
        { name: 'Seated hamstring leg curl', muscle: 'hamstrings', weight: 'Working wt', sets: '3 x 12', cue: 'Controlled lower on every rep.' },
        { name: 'Clamshells', muscle: 'glute med', weight: 'Bodyweight', sets: '3 x 15 ea', cue: 'Knees bent 45 deg, feet stacked, 2-sec hold at top.' },
      ],
      warmup: '8 min: Cat-cow, hip circles, hamstring swings, good mornings, glute bridges, hip thrust rehearsal',
      stretches: 'Pigeon (3 min), supine hamstring (1.5 min), low lunge hip flexor (2 min), happy baby (1 min)',
      sauna: '15 min with stretches'
    },
    { day: 'Tue', label: 'Arms + Shoulders', focus: 'Bicep curl, hammer curl, tricep pushdown, lateral raises',
      exercises: [
        { name: 'Dumbbell bicep curl', muscle: 'biceps', weight: '12 lbs', sets: '3 x 12', cue: 'Full range. No swinging.' },
        { name: 'Hammer curl', muscle: 'biceps', weight: '12 lbs', sets: '3 x 12', cue: 'Neutral grip. Squeeze at top.' },
        { name: 'Tricep pushdown', muscle: 'triceps', weight: '25 lbs', sets: '3 x 12', cue: 'Elbows pinned to sides.' },
        { name: 'Overhead tricep extension', muscle: 'triceps', weight: '15 lbs', sets: '3 x 12', cue: 'One dumbbell, both hands.' },
        { name: 'Lateral raise', muscle: 'shoulders', weight: '8 lbs', sets: '3 x 15', cue: 'Slight bend in elbows. Lift to shoulder height only.' },
      ],
      warmup: '6 min: Arm circles, band pull-aparts, light curls',
      stretches: 'Doorway chest stretch (2 min), cross-body shoulder (1.5 min), tricep overhead (1 min)',
      sauna: '15 min'
    },
    { day: 'Wed', label: 'Back + Rear Delts', focus: 'Bent-over row introduced, lat pulldown, cable row, rear delt fly',
      exercises: [
        { name: 'Bent-over barbell row', muscle: 'back', weight: '45 lbs (bar)', sets: '4 x 10', cue: 'NEW exercise this week. Hinge at hips, pull bar to lower chest. Squeeze shoulder blades.' },
        { name: 'Lat pulldown', muscle: 'lats', weight: 'Working wt', sets: '3 x 12', cue: 'Wide grip, pull to upper chest, control the return.' },
        { name: 'Seated cable row', muscle: 'mid-back', weight: 'Working wt', sets: '3 x 12', cue: 'Squeeze shoulder blades together at every rep.' },
        { name: 'Rear delt fly (machine)', muscle: 'rear delts', weight: 'Light', sets: '3 x 15', cue: 'Slight bend in elbows, squeeze at the back.' },
        { name: 'Face pull', muscle: 'rear delts', weight: 'Light', sets: '3 x 15', cue: 'Pull to face level, external rotate at the end.' },
      ],
      warmup: '6 min: Band pull-aparts, cat-cow, light lat pulldown',
      stretches: 'Child\'s pose (2 min), thread the needle (2 min), doorway stretch (1.5 min)',
      sauna: '15 min'
    },
    { day: 'Thu', label: 'Quads + Abs', focus: 'BSS, goblet squat, plank, bicycle crunch, leg raise',
      exercises: [
        { name: 'Bulgarian split squat', muscle: 'quad sweep', weight: 'Bodyweight', sets: '4 x 8 ea', cue: 'Rear foot on bench. If balance is the limiting factor, hold one light dumbbell as counterweight.' },
        { name: 'Goblet squat', muscle: 'quads', weight: '25 lbs', sets: '3 x 12', cue: 'Dumbbell at chest. Sit deep. Elbows inside knees.' },
        { name: 'Plank', muscle: 'core', weight: '-', sets: '3 x 45 sec', cue: 'Forearms flat. Squeeze glutes. Straight line head to heels.' },
        { name: 'Bicycle crunch', muscle: 'obliques', weight: '-', sets: '3 x 15 ea', cue: 'Slow full rotation. Should feel hard at 15 reps.' },
        { name: 'Leg raise', muscle: 'lower abs', weight: '-', sets: '3 x 12', cue: 'Lower back pressed into mat. Stop the moment back arches.' },
      ],
      warmup: '7 min: Bodyweight squats, hip circles, ankle mobility, glute bridges',
      stretches: 'Standing quad stretch (1.5 min), low lunge (2 min), calf stretch (1 min), seated forward fold (1.5 min)',
      sauna: '15 min'
    },
    { day: 'Fri', label: 'Mobility · 35-40 min', focus: 'Hip flexors, thoracic spine, hamstrings, shoulders, breathwork',
      exercises: [
        { name: 'Cat-cow with spinal wave', muscle: 'spine', weight: '-', sets: '3 min', cue: 'Slow undulation from tailbone to neck.' },
        { name: 'Low lunge hip flexor hold', muscle: 'hip flexors', weight: '-', sets: '3 min', cue: 'Deep lunge, back knee on floor. No bouncing.' },
        { name: '90/90 hip stretch', muscle: 'hips', weight: '-', sets: '3 min', cue: 'Both knees at 90 deg. Sit tall, lean over front shin.' },
        { name: 'Pigeon pose', muscle: 'glutes', weight: '-', sets: '3 min', cue: 'Sink hips toward floor. Hold still and breathe.' },
        { name: 'Thread the needle', muscle: 'thoracic', weight: '-', sets: '3 min', cue: 'Slide arm under body. Let shoulder drop to floor.' },
        { name: '4-7-8 breathing', muscle: 'recovery', weight: '-', sets: '3 min', cue: 'Inhale 4, hold 7, exhale 8. Activates vagus nerve.' },
      ],
      warmup: 'N/A - this is the recovery session',
      stretches: 'Integrated into session',
      sauna: 'Optional'
    },
  ],
  meals: {
    schedule: [
      { time: '~4:15am', what: 'Adderall 20mg + full glass water', notes: 'Not dry' },
      { time: '~5:10am', what: 'Banana (half to full)', notes: 'Pre-gym carbs only' },
      { time: '~7:30am', what: 'Morning smoothie + 5g creatine', notes: '1 cup berries, Coffee Mate, Oikos Pro, 1/4 avocado, creatine · ~630 cal · 26g protein' },
      { time: 'With smoothie', what: 'Ritual multivitamin', notes: 'Avocado fat improves absorption' },
      { time: '~1:30-2pm', what: 'Lemon herb chicken thighs + french green beans + rice', notes: 'Take spironolactone 100mg with this meal · ~530 cal · 38g protein' },
      { time: '~3:30-4pm', what: 'Oikos Salted Caramel Protein Shake', notes: '30g protein · 170 cal · mandatory even on low-appetite days' },
      { time: '~6:30-7pm', what: 'Spaghetti with meat sauce', notes: 'Your recipe. Stop water 20 min before. Pair with Coke Mini. ~570 cal · 34g protein' },
      { time: 'After dinner', what: '2 Pillsbury cookies', notes: 'Every night' },
    ],
    macros: { calories: '1,800', protein: '100g', carbs: '200g', fat: '60g' },
    note: 'Water goal: 4 tumblers (32oz). Front-load before noon. Taper by 5:30pm.',
  },
  skin: {
    phase: 'Early follicular - estrogen rising, skin clearing. Oil production normalizing. Be consistent this week.',
    morning: [
      { step: 1, name: 'Lukewarm water rinse only', note: 'No cleanser in the morning.' },
      { step: 2, name: 'CeraVe Daily Moisturizing Lotion', note: 'Apply to slightly damp skin.' },
      { step: 3, name: 'Black Girl Sunscreen SPF 30', note: 'Every morning without exception. Most important step for PIH fading.' },
    ],
    postGym: [
      { step: 1, name: 'Cetaphil Daily Facial Cleanser', note: 'Within 10-15 min of leaving sauna.' },
      { step: 2, name: 'CeraVe Daily Moisturizing Lotion', note: 'Reapply after cleansing.' },
      { step: 3, name: 'Reapply SPF 30', note: 'Only if going outside after gym.' },
    ],
    evening: [
      { step: 1, name: 'Cetaphil Daily Facial Cleanser', note: 'Every night. Most important step of the day.' },
      { step: 2, name: 'Azelaic acid (Mon/Wed/Fri)', note: 'Thin layer after cleansing. Skip to moisturizer on off nights.' },
      { step: 3, name: 'CeraVe Daily Moisturizing Lotion', note: 'Wait 2-3 min after acid before applying.' },
      { step: 4, name: 'Gua sha (Mon/Wed/Fri)', note: 'After moisturizer. Always on moisturized skin. Slow upward strokes.' },
    ],
  },
  grocery: {
    wegmans: [
      { cat: 'Meat', items: ['Bone-in chicken thighs (5-6)', 'Ground beef 80/20 - 1.5 lbs'] },
      { cat: 'Produce', items: ['French green beans', 'Lemons (2-3)', 'Fresh garlic + thyme/rosemary', 'Yellow onion (1)', 'Bananas (7+)', 'Avocados (5-6 small)'] },
      { cat: 'Dairy', items: ['Oikos Pro vanilla yogurt (5-7)', 'Pillsbury cookie dough', 'Butter (unsalted)'] },
      { cat: 'Pantry', items: ['Ragu Traditional sauce', 'Thin spaghetti noodles'] },
      { cat: 'Drinks', items: ['Coke Mini or Sicilian Lemon soda'] },
    ],
    costco: ['Frozen mixed berries (Kirkland)', 'White jasmine rice', 'Ground beef 80/20 (bulk)'],
    amazon: ['Oikos Salted Caramel Protein Shakes (12-ct)', 'Thorne Creatine (Creapure)'],
    have: 'Coffee Mate, Creatine, Ritual multivitamin, basic spices',
  },
  prep: {
    total: '~2.5 hours',
    note: 'Two proteins: chicken thighs for lunch, spaghetti for dinner. Smaller portions so you finish the container.',
    equipment: 'Sheet pan, large skillet, large pot, rice cooker, 5 lunch containers, 5 dinner containers, zip bags, baking sheet',
    steps: [
      { time: 'Hour 1', title: 'Preheat, season, start rice, brown beef', detail: 'Oven to 425F. Season chicken thighs with salt, pepper, garlic, lemon zest, thyme, olive oil. Skin side up. Rice cooker on. Brown 1.5 lbs ground beef with onion, add spices and Ragu, simmer.' },
      { time: '~30 min', title: 'Cook pasta, prep green beans', detail: 'Boil thin spaghetti 1 min less than package. Toss with olive oil. Trim green beans or microwave steam-in-bag. Mix pasta into sauce.' },
      { time: '~45 min', title: 'Pull chicken, portion everything, cookies in oven', detail: 'Rest chicken 5 min. Portion: 1 thigh + green beans + rice per lunch container. Spaghetti divided into 5 dinner containers. Cookies in oven. Portion berries into 5 zip bags.' },
      { time: 'Final 30 min', title: 'Cool, seal, store, set up for the week', detail: 'Cool with lids open. Label lunch vs dinner. Bag cookies. Honey in gym bag. Oikos shakes visible. Spironolactone accessible at lunch.' },
    ],
  },
};

var TABS = ['Workout', 'Meals', 'Skin', 'Grocery', 'Prep'];

export default function WellnessPage() {
  var dataCtx = useData();
  var tabState = useState('Workout');
  var tab = tabState[0]; var setTab = tabState[1];
  var dayState = useState(0);
  var activeDay = dayState[0]; var setActiveDay = dayState[1];
  var checkState = useState({});
  var checked = checkState[0]; var setChecked = checkState[1];

  function toggleCheck(key) {
    setChecked(function(p) { var n = Object.assign({}, p); n[key] = !n[key]; return n; });
  }

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          Weekly Wellness
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Workouts, meals, skincare, grocery lists, and meal prep</p>
      </div>

      {/* Week header */}
      <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '22px', color: brown }}>{WEEK.title}</p>
          <p style={{ fontSize: '13px', color: textSoft, marginTop: '4px' }}>{WEEK.overview}</p>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, background: accentDark, color: '#fff', borderRadius: '6px', padding: '4px 14px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: sans }}>{WEEK.phase}</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '3px', background: '#EDE5DA', borderRadius: '10px', padding: '3px', marginBottom: '18px', border: '1px solid rgba(93,66,51,0.06)', flexWrap: 'wrap' }}>
        {TABS.map(function(t) {
          var active = tab === t;
          return <button key={t} onClick={function(){setTab(t);}} style={{ flex: 1, fontFamily: sans, fontSize: '13px', fontWeight: active ? 600 : 400, padding: '10px 6px', borderRadius: '8px', border: 'none', background: active ? '#FFFFFF' : 'transparent', color: active ? brown : textSoft, cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none', minWidth: '68px', textAlign: 'center' }}>{t}</button>;
        })}
      </div>

      {/* WORKOUT TAB */}
      {tab === 'Workout' && (
        <div>
          <div style={card}>
            <div style={cardTitle}>Week at a Glance</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead><tr>{['Day','Session','Key Focus'].map(function(h){return <th key={h} style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, textAlign: 'left', padding: '0 10px 8px 0', borderBottom: '1px solid rgba(93,66,51,0.06)', fontFamily: sans }}>{h}</th>;})}</tr></thead>
              <tbody>{WEEK.workouts.map(function(w, i){return <tr key={i}><td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', fontWeight: 600, color: brown, fontSize: '13px', fontFamily: sans }}>{w.day}</td><td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', color: text, fontFamily: sans }}>{w.label}</td><td style={{ padding: '10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', color: textSoft, fontSize: '13px', fontFamily: sans }}>{w.focus}</td></tr>;})}</tbody>
            </table>
          </div>

          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: '10px', fontFamily: sans }}>Day by Day</p>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {WEEK.workouts.map(function(w, i) {
              var active = activeDay === i;
              return <button key={i} onClick={function(){setActiveDay(i);}} style={{ fontFamily: sans, fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '8px', border: '1.5px solid ' + (active ? accentDark : 'rgba(93,66,51,0.1)'), background: active ? accentDark : '#FFFFFF', color: active ? '#fff' : text, cursor: 'pointer' }}>{w.day} · {w.label.split(' ·')[0]}</button>;
            })}
          </div>

          {(function() {
            var w = WEEK.workouts[activeDay];
            return (
              <div>
                <div style={{ ...card, borderLeft: '3px solid ' + accentDark }}>
                  <p style={{ fontFamily: sans, fontSize: '11px', fontWeight: 600, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Warmup</p>
                  <p style={{ fontSize: '14px', color: text, fontFamily: sans }}>{w.warmup}</p>
                </div>

                <div style={card}>
                  <div style={cardTitle}>Exercises</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: '8px', padding: '0 0 8px', borderBottom: '1px solid rgba(93,66,51,0.06)', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, fontFamily: sans }}>Exercise</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, textAlign: 'right', fontFamily: sans }}>Weight</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, textAlign: 'right', fontFamily: sans }}>Sets x Reps</span>
                  </div>
                  {w.exercises.map(function(ex, j) {
                    return (
                      <div key={j} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: '8px', padding: '12px 0', borderBottom: '1px solid rgba(93,66,51,0.04)' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: brown, fontFamily: sans }}>{ex.name} {ex.muscle && <span style={{ fontSize: '10px', fontWeight: 700, borderRadius: '4px', padding: '1px 6px', marginLeft: '6px', background: '#EDE5DA', color: text, border: '1px solid rgba(93,66,51,0.08)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{ex.muscle}</span>}</p>
                          <p style={{ fontSize: '13px', color: textSoft, marginTop: '4px', lineHeight: 1.5, fontFamily: sans }}>{ex.cue}</p>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 700, textAlign: 'right', color: brown, fontFamily: sans }}>{ex.weight}</p>
                        <p style={{ fontSize: '14px', textAlign: 'right', color: text, fontFamily: sans }}>{ex.sets}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ ...card, borderLeft: '3px solid #5a9870' }}>
                    <p style={{ fontFamily: sans, fontSize: '11px', fontWeight: 600, color: '#5a9870', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Post-Workout Stretches</p>
                    <p style={{ fontSize: '14px', color: text, fontFamily: sans }}>{w.stretches}</p>
                  </div>
                  <div style={{ ...card, borderLeft: '3px solid #c4903a' }}>
                    <p style={{ fontFamily: sans, fontSize: '11px', fontWeight: 600, color: '#c4903a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Sauna</p>
                    <p style={{ fontSize: '14px', color: text, fontFamily: sans }}>{w.sauna}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MEALS TAB */}
      {tab === 'Meals' && (
        <div>
          <div style={card}>
            <div style={cardTitle}>Daily Meal + Supplement Schedule</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Time','What','Notes'].map(function(h){return <th key={h} style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, textAlign: 'left', padding: '0 10px 8px 0', borderBottom: '1px solid rgba(93,66,51,0.06)', fontFamily: sans }}>{h}</th>;})}</tr></thead>
              <tbody>{WEEK.meals.schedule.map(function(m, i){return <tr key={i}><td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', fontWeight: 600, color: brown, fontSize: '13px', whiteSpace: 'nowrap', fontFamily: sans }}>{m.time}</td><td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', color: text, fontSize: '14px', fontFamily: sans }}>{m.what}</td><td style={{ padding: '10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', color: textSoft, fontSize: '13px', fontStyle: 'italic', fontFamily: sans }}>{m.notes}</td></tr>;})}</tbody>
            </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {[['calories','Calories'],['protein','Protein'],['carbs','Carbs'],['fat','Fat']].map(function(item){
              return <div key={item[0]} style={{ background: '#EDE5DA', borderRadius: '12px', padding: '16px 8px', textAlign: 'center', border: '1px solid rgba(93,66,51,0.06)' }}>
                <p style={{ fontSize: '24px', fontWeight: 700, color: brown, fontFamily: sans }}>{WEEK.meals.macros[item[0]]}</p>
                <p style={{ fontSize: '10px', fontWeight: 700, color: textMuted, marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: sans }}>{item[1]}</p>
              </div>;
            })}
          </div>

          <div style={{ ...card, borderLeft: '3px solid #5b7ec4' }}>
            <p style={{ fontSize: '14px', color: text, fontFamily: sans }}>{WEEK.meals.note}</p>
          </div>
        </div>
      )}

      {/* SKIN TAB */}
      {tab === 'Skin' && (
        <div>
          <div style={{ ...card, borderLeft: '3px solid ' + accentDark }}>
            <p style={{ fontSize: '14px', color: text, fontFamily: sans }}>{WEEK.skin.phase}</p>
          </div>

          {[['Morning Routine · Every Day', WEEK.skin.morning], ['Post-Gym · Gym Days Only', WEEK.skin.postGym], ['Evening Routine · Every Night', WEEK.skin.evening]].map(function(section) {
            return (
              <div key={section[0]} style={card}>
                <div style={cardTitle}>{section[0]}</div>
                {section[1].map(function(s) {
                  return (
                    <div key={s.step} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', alignItems: 'flex-start' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: accentDark, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0, fontFamily: sans }}>{s.step}</div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: brown, fontFamily: sans }}>{s.name}</p>
                        <p style={{ fontSize: '13px', color: textSoft, marginTop: '3px', lineHeight: 1.5, fontFamily: sans }}>{s.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* GROCERY TAB */}
      {tab === 'Grocery' && (
        <div>
          <div style={{ ...card, borderLeft: '3px solid ' + accent }}>
            <p style={{ fontFamily: sans, fontSize: '12px', fontWeight: 600, color: brown, marginBottom: '4px' }}>Already have - skip these</p>
            <p style={{ fontSize: '14px', color: textSoft, fontFamily: sans }}>{WEEK.grocery.have}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0 6px' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: brown, fontFamily: sans }}>Wegmans</p>
            <span style={{ fontSize: '10px', fontWeight: 700, borderRadius: '4px', padding: '2px 10px', background: '#EAF0EA', color: '#2A5030', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Wegmans</span>
          </div>
          {WEEK.grocery.wegmans.map(function(group) {
            return (
              <div key={group.cat} style={card}>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, marginBottom: '10px', fontFamily: sans }}>{group.cat}</p>
                {group.items.map(function(item, i) {
                  var key = 'weg-' + group.cat + '-' + i;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(93,66,51,0.04)' }}>
                      <input type="checkbox" checked={!!checked[key]} onChange={function(){toggleCheck(key);}} style={{ width: '17px', height: '17px', accentColor: accentDark, cursor: 'pointer' }} />
                      <span style={{ fontSize: '15px', color: checked[key] ? textMuted : text, textDecoration: checked[key] ? 'line-through' : 'none', fontFamily: sans }}>{item}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0 6px' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: brown, fontFamily: sans }}>Costco</p>
            <span style={{ fontSize: '10px', fontWeight: 700, borderRadius: '4px', padding: '2px 10px', background: '#EAECF5', color: '#1A2A70', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Costco</span>
          </div>
          <div style={card}>
            {WEEK.grocery.costco.map(function(item, i) {
              var key = 'cos-' + i;
              return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(93,66,51,0.04)' }}><input type="checkbox" checked={!!checked[key]} onChange={function(){toggleCheck(key);}} style={{ width: '17px', height: '17px', accentColor: accentDark, cursor: 'pointer' }} /><span style={{ fontSize: '15px', color: checked[key] ? textMuted : text, textDecoration: checked[key] ? 'line-through' : 'none', fontFamily: sans }}>{item}</span></div>;
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0 6px' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: brown, fontFamily: sans }}>Amazon</p>
            <span style={{ fontSize: '10px', fontWeight: 700, borderRadius: '4px', padding: '2px 10px', background: '#EDE5DA', color: accentDark, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Amazon</span>
          </div>
          <div style={card}>
            {WEEK.grocery.amazon.map(function(item, i) {
              var key = 'amz-' + i;
              return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: '1px solid rgba(93,66,51,0.04)' }}><input type="checkbox" checked={!!checked[key]} onChange={function(){toggleCheck(key);}} style={{ width: '17px', height: '17px', accentColor: accentDark, cursor: 'pointer' }} /><span style={{ fontSize: '15px', color: checked[key] ? textMuted : text, textDecoration: checked[key] ? 'line-through' : 'none', fontFamily: sans }}>{item}</span></div>;
            })}
          </div>
        </div>
      )}

      {/* PREP TAB */}
      {tab === 'Prep' && (
        <div>
          <div style={{ ...card, borderLeft: '3px solid ' + accentDark }}>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '18px', color: brown, marginBottom: '4px' }}>Sunday Prep · {WEEK.prep.total}</p>
            <p style={{ fontSize: '14px', color: textSoft, fontFamily: sans }}>{WEEK.prep.note}</p>
          </div>

          <div style={card}>
            <div style={cardTitle}>Equipment to Set Out</div>
            <p style={{ fontSize: '14px', color: text, lineHeight: 1.7, fontFamily: sans }}>{WEEK.prep.equipment}</p>
          </div>

          <div style={card}>
            <div style={cardTitle}>Step by Step</div>
            {WEEK.prep.steps.map(function(s, i) {
              return (
                <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: accent, minWidth: '80px', flexShrink: 0, paddingTop: '2px', fontFamily: sans }}>{s.time}</span>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: brown, fontFamily: sans }}>{s.title}</p>
                    <p style={{ fontSize: '13px', color: textSoft, marginTop: '4px', lineHeight: 1.6, fontFamily: sans }}>{s.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
