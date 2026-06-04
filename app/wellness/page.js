'use client';

import { useState } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";
var brown = '#5D4233'; var text = '#6B5A50'; var textSoft = 'rgba(93,66,51,0.55)';
var textMuted = 'rgba(93,66,51,0.35)'; var accent = '#9C7B65'; var accentDark = '#6B4F3E';
var card = { background: '#FFFFFF', border: '1px solid rgba(93,66,51,0.06)', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(93,66,51,0.03)', marginBottom: '14px' };
var cardTitle = { fontFamily: sans, fontSize: '15px', fontWeight: 600, color: brown, marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(93,66,51,0.06)' };
var inp = { width: '100%', padding: '9px 12px', border: '1px solid rgba(93,66,51,0.12)', borderRadius: '8px', fontSize: '13px', fontFamily: sans, color: text, background: '#FAF7F3', outline: 'none', marginBottom: '0' };

var TABS = ['Workout', 'Meals', 'Skin', 'Grocery', 'Prep'];

var PANTRY_ITEMS = [
  'Coffee Mate French Vanilla', 'Oikos Pro vanilla yogurt', 'Thorne Creatine',
  'Ritual multivitamin', 'Frozen mixed berries', 'Rice (white jasmine)',
  'Olive oil', 'Butter (unsalted)', 'Basic spices', 'Brown sugar',
  'Smoked paprika', 'Avocados', 'Bananas', 'Pillsbury cookie dough',
  'Oikos Salted Caramel Protein Shakes', 'Coke Mini / Sicilian Lemon soda',
  'Ragu Traditional sauce', 'Thin spaghetti noodles', 'Honey packets',
];

var EXERCISES = [
  'Barbell hip thrust', 'Romanian deadlift (RDL)', 'Seated hamstring leg curl',
  'Clamshells', 'Dumbbell bicep curl', 'Hammer curl', 'Tricep pushdown (rope)',
  'Overhead tricep extension', 'Lateral raise', 'Dumbbell shoulder press',
  'Bent-over dumbbell row', 'Single-arm dumbbell row', 'Lat pulldown machine',
  'Seated cable row', 'Rear delt fly machine', 'Face pull', 'Bulgarian split squat',
  'Goblet squat', 'Reverse lunge', 'Plank', 'Bicycle crunch', 'Leg raise',
  'Push-ups', 'Dead bug',
];

var DEFAULT_WEEK = {
  title: 'Week of June 1-5',
  phase: 'Follicular · Days 4-8 · New split begins',
  overview: 'Period ended May 28. Estrogen rising, energy returning. First full week on restructured split. Train at full effort.',
  workouts: [
    { day: 'Mon', label: 'Glutes + Hamstrings · Heavy', focus: 'Hip thrusts, leg curl, clamshells', exercises: [{ name: 'Barbell hip thrust', muscle: 'glutes', weight: '85 lbs', sets: '4 x 10-12', cue: 'Shins vertical at top. Posterior pelvic tilt. 2-sec squeeze.' },{ name: 'Seated hamstring leg curl', muscle: 'hamstrings', weight: 'Working wt', sets: '3 x 12', cue: 'Controlled lower on every rep.' },{ name: 'Clamshells', muscle: 'glute med', weight: 'Bodyweight', sets: '3 x 15 ea', cue: 'Feet stacked, 2-sec hold at top.' }], warmup: '8 min: Cat-cow, hip circles, hamstring swings, glute bridges', stretches: 'Pigeon (3 min), supine hamstring (1.5 min), low lunge (2 min)', sauna: '15 min' },
    { day: 'Tue', label: 'Arms + Shoulders', focus: 'Bicep curl, hammer curl, tricep pushdown, lateral raises', exercises: [{ name: 'Dumbbell bicep curl', muscle: 'biceps', weight: '12 lbs', sets: '3 x 12', cue: 'Full range. No swinging.' },{ name: 'Hammer curl', muscle: 'biceps', weight: '12 lbs', sets: '3 x 12', cue: 'Neutral grip. Squeeze at top.' },{ name: 'Tricep pushdown', muscle: 'triceps', weight: '25 lbs', sets: '3 x 12', cue: 'Elbows pinned to sides.' },{ name: 'Lateral raise', muscle: 'shoulders', weight: '8 lbs', sets: '3 x 15', cue: 'Lift to shoulder height only.' }], warmup: '6 min: Arm circles, band pull-aparts, light curls', stretches: 'Doorway chest stretch (2 min), cross-body shoulder (1.5 min)', sauna: '15 min' },
    { day: 'Wed', label: 'Back + Rear Delts', focus: 'Bent-over row, lat pulldown, cable row', exercises: [{ name: 'Bent-over barbell row', muscle: 'back', weight: '45 lbs', sets: '4 x 10', cue: 'NEW. Hinge at hips, pull bar to lower chest. Squeeze shoulder blades.' },{ name: 'Lat pulldown', muscle: 'lats', weight: 'Working wt', sets: '3 x 12', cue: 'Pull to upper chest, control the return.' },{ name: 'Seated cable row', muscle: 'mid-back', weight: 'Working wt', sets: '3 x 12', cue: 'Squeeze shoulder blades at every rep.' },{ name: 'Face pull', muscle: 'rear delts', weight: 'Light', sets: '3 x 15', cue: 'Pull to face level, external rotate at end.' }], warmup: '6 min: Band pull-aparts, cat-cow, light lat pulldown', stretches: "Child's pose (2 min), thread the needle (2 min)", sauna: '15 min' },
    { day: 'Thu', label: 'Quads + Abs', focus: 'BSS, goblet squat, plank, bicycle crunch', exercises: [{ name: 'Bulgarian split squat', muscle: 'quads', weight: 'Bodyweight', sets: '4 x 8 ea', cue: 'Rear foot on bench. Hold light dumbbell as counterweight if needed.' },{ name: 'Goblet squat', muscle: 'quads', weight: '25 lbs', sets: '3 x 12', cue: 'Dumbbell at chest. Sit deep. Elbows inside knees.' },{ name: 'Plank', muscle: 'core', weight: '-', sets: '3 x 45 sec', cue: 'Forearms flat. Squeeze glutes.' },{ name: 'Bicycle crunch', muscle: 'obliques', weight: '-', sets: '3 x 15 ea', cue: 'Slow full rotation.' }], warmup: '7 min: Bodyweight squats, hip circles, ankle mobility', stretches: 'Standing quad (1.5 min), low lunge (2 min), seated forward fold (1.5 min)', sauna: '15 min' },
    { day: 'Fri', label: 'Mobility · 35-40 min', focus: 'Hip flexors, thoracic, hamstrings, breathwork', exercises: [{ name: 'Cat-cow with spinal wave', muscle: 'spine', weight: '-', sets: '3 min', cue: 'Slow undulation from tailbone to neck.' },{ name: 'Low lunge hip flexor hold', muscle: 'hip flexors', weight: '-', sets: '3 min', cue: 'Deep lunge. No bouncing.' },{ name: '90/90 hip stretch', muscle: 'hips', weight: '-', sets: '3 min', cue: 'Both knees at 90 deg. Sit tall.' },{ name: 'Pigeon pose', muscle: 'glutes', weight: '-', sets: '3 min', cue: 'Sink hips. Breathe.' },{ name: '4-7-8 breathing', muscle: 'recovery', weight: '-', sets: '3 min', cue: 'Inhale 4, hold 7, exhale 8.' }], warmup: 'N/A - this is the recovery session', stretches: 'Integrated into session', sauna: 'Optional' },
  ],
  meals: {
    schedule: [
      { time: '~4:15am', what: 'Adderall 20mg + full glass water', notes: 'Weekdays only' },
      { time: '~5:10am', what: 'Banana (half to full)', notes: 'Pre-gym carbs only' },
      { time: '~7:30am', what: 'Morning smoothie + 5g creatine + Ritual vitamin', notes: '~630 cal · 26g protein' },
      { time: '~1:30pm', what: 'Chicken thighs + green beans + rice', notes: 'Take spironolactone with this meal · ~530 cal · 38g protein' },
      { time: '~3:30pm', what: 'Oikos Salted Caramel Protein Shake', notes: '30g protein · 170 cal · mandatory' },
      { time: '~6:30pm', what: 'Spaghetti with meat sauce', notes: 'Pair with Coke Mini · ~570 cal · 34g protein' },
      { time: 'After dinner', what: '2 Pillsbury cookies', notes: 'Every night' },
    ],
    macros: { calories: '1,800', protein: '100g', carbs: '200g', fat: '60g' },
    note: 'Water goal: 4 tumblers (32oz). Front-load before noon. Taper by 5:30pm.',
  },
  skin: {
    phase: 'Early follicular — estrogen rising, skin clearing. Be consistent this week.',
    morning: [{ step: 1, name: 'Lukewarm water rinse only', note: 'No cleanser in the morning.' },{ step: 2, name: 'CeraVe Daily Moisturizing Lotion', note: 'Apply to slightly damp skin.' },{ step: 3, name: 'Black Girl Sunscreen SPF 30', note: 'Every morning without exception.' }],
    postGym: [{ step: 1, name: 'Cetaphil Daily Facial Cleanser', note: 'Within 10-15 min of leaving sauna.' },{ step: 2, name: 'CeraVe Daily Moisturizing Lotion', note: 'Reapply after cleansing.' }],
    evening: [{ step: 1, name: 'Cetaphil Daily Facial Cleanser', note: 'Every night.' },{ step: 2, name: 'Azelaic acid (Mon/Wed/Fri)', note: 'Thin layer. Skip on off nights.' },{ step: 3, name: 'CeraVe Daily Moisturizing Lotion', note: 'Wait 2-3 min after acid.' },{ step: 4, name: 'Gua sha (Mon/Wed/Fri)', note: 'After moisturizer. Slow upward strokes.' }],
  },
  grocery: {
    wegmans: [{ cat: 'Meat', items: ['Bone-in chicken thighs (5-6)', 'Ground beef 80/20 - 1.5 lbs'] },{ cat: 'Produce', items: ['French green beans', 'Lemons (2-3)', 'Yellow onion (1)', 'Fresh garlic + thyme'] },{ cat: 'Dairy', items: ['Oikos Pro vanilla yogurt (5-7)', 'Pillsbury cookie dough', 'Butter (unsalted)'] },{ cat: 'Pantry', items: ['Ragu Traditional sauce', 'Thin spaghetti noodles'] }],
    costco: ['Frozen mixed berries (Kirkland)', 'White jasmine rice'],
    amazon: ['Oikos Salted Caramel Protein Shakes (12-ct)', 'Thorne Creatine'],
    have: 'Coffee Mate, Creatine, Ritual multivitamin, basic spices',
  },
  prep: {
    total: '~2.5 hours',
    note: 'Two proteins: chicken thighs for lunch, spaghetti for dinner.',
    equipment: 'Sheet pan, large skillet, large pot, rice cooker, 5 lunch containers, 5 dinner containers, zip bags',
    steps: [
      { time: 'Hour 1', title: 'Preheat, season chicken, start rice, brown beef', detail: 'Oven to 425F. Season chicken thighs with lemon, garlic, thyme, olive oil. Skin side up on sheet pan. Rice cooker on. Brown 1.5 lbs ground beef with onion, add Ragu, simmer.' },
      { time: '~30 min', title: 'Cook pasta, prep green beans', detail: 'Boil thin spaghetti 1 min less than package. Toss with olive oil. Trim or steam green beans. Mix pasta into sauce.' },
      { time: '~45 min', title: 'Pull chicken, portion everything, cookies in oven', detail: 'Rest chicken 5 min. Portion: 1 thigh + green beans + rice per lunch container. Spaghetti into 5 dinner containers. Cookies in oven. Portion berries into 5 zip bags.' },
      { time: 'Final 30 min', title: 'Cool, seal, store, set up for the week', detail: 'Cool with lids open. Label containers. Bag cookies. Oikos shakes visible. Spironolactone accessible at lunch.' },
    ],
  },
};

function MultiSelect({ options, selected, onChange }) {
  function toggle(v) { onChange(selected.includes(v) ? selected.filter(function(x){return x!==v;}) : selected.concat([v])); }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {options.map(function(o) {
        var on = selected.includes(o);
        return <button key={o} onClick={function(){toggle(o);}} style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', border: '1px solid ' + (on ? accent : 'rgba(93,66,51,0.12)'), background: on ? accent + '15' : 'transparent', color: on ? accentDark : textSoft, cursor: 'pointer', fontFamily: sans }}>{o}</button>;
      })}
    </div>
  );
}

function PlanNewWeekModal({ onClose, onComplete }) {
  var stepState = useState(0);
  var step = stepState[0]; var setStep = stepState[1];
  var answersState = useState({});
  var answers = answersState[0]; var setAnswers = answersState[1];
  var generatingState = useState(false);
  var generating = generatingState[0]; var setGenerating = generatingState[1];
  var errorState = useState(null);
  var error = errorState[0]; var setError = errorState[1];

  function update(key, val) { setAnswers(function(a){return Object.assign({},a,{[key]:val});}); }

  var STEPS = [
    { title: 'Cycle Check', content: (
      <div>
        <label style={lbl}>When did your last period start?</label>
        <input type="date" value={answers.periodStart||''} onChange={function(e){update('periodStart',e.target.value);}} style={{...inp, marginBottom:'12px'}} />
        <label style={lbl}>Is your period currently active?</label>
        <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
          {['Yes','No'].map(function(v){return <button key={v} onClick={function(){update('periodActive',v);}} style={{padding:'8px 20px',borderRadius:'20px',border:'1px solid '+(answers.periodActive===v?accentDark:'rgba(93,66,51,0.12)'),background:answers.periodActive===v?accentDark:'transparent',color:answers.periodActive===v?'#fff':textSoft,cursor:'pointer',fontFamily:sans,fontSize:'13px'}}>{v}</button>;})}
        </div>
        {answers.periodActive==='Yes' && (
          <div>
            <label style={lbl}>What day are you on?</label>
            <div style={{display:'flex',gap:'6px'}}>
              {[1,2,3,4,5].map(function(d){return <button key={d} onClick={function(){update('periodDay','Day '+d);}} style={{padding:'7px 14px',borderRadius:'20px',border:'1px solid '+(answers.periodDay==='Day '+d?accentDark:'rgba(93,66,51,0.12)'),background:answers.periodDay==='Day '+d?accentDark:'transparent',color:answers.periodDay==='Day '+d?'#fff':textSoft,cursor:'pointer',fontFamily:sans,fontSize:'12px'}}>Day {d}</button>;})}
            </div>
          </div>
        )}
        {answers.periodActive==='No' && (
          <div>
            <label style={lbl}>When did it end?</label>
            <input type="date" value={answers.periodEnd||''} onChange={function(e){update('periodEnd',e.target.value);}} style={inp} />
          </div>
        )}
      </div>
    )},
    { title: 'Physical Status', content: (
      <div>
        <label style={lbl}>How are you feeling physically today?</label>
        {['Mild — manageable, not affecting much','Moderate — noticeable but I can train','Heavy — cramps and fatigue are real today'].map(function(v){
          return <button key={v} onClick={function(){update('physicalStatus',v);}} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 16px',borderRadius:'10px',border:'1px solid '+(answers.physicalStatus===v?accentDark:'rgba(93,66,51,0.12)'),background:answers.physicalStatus===v?accentDark+'10':'transparent',color:answers.physicalStatus===v?accentDark:text,cursor:'pointer',fontFamily:sans,fontSize:'13px',marginBottom:'8px'}}>{v}</button>;
        })}
      </div>
    )},
    { title: 'Lunch Protein', content: (
      <div>
        <label style={lbl}>Which protein for lunch this week?</label>
        {['Chicken thighs','Steak (strip steak)','Lamb chops','Pork chops','Ground beef'].map(function(v){
          return <button key={v} onClick={function(){update('lunchProtein',v);}} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 16px',borderRadius:'10px',border:'1px solid '+(answers.lunchProtein===v?accentDark:'rgba(93,66,51,0.12)'),background:answers.lunchProtein===v?accentDark+'10':'transparent',color:answers.lunchProtein===v?accentDark:text,cursor:'pointer',fontFamily:sans,fontSize:'13px',marginBottom:'8px'}}>{v}</button>;
        })}
      </div>
    )},
    { title: 'Lunch Vegetable', content: (
      <div>
        <label style={lbl}>What vegetable with lunch?</label>
        {['French green beans','Roasted broccoli','Steamed broccoli','Roasted brussels sprouts'].map(function(v){
          return <button key={v} onClick={function(){update('lunchVeg',v);}} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 16px',borderRadius:'10px',border:'1px solid '+(answers.lunchVeg===v?accentDark:'rgba(93,66,51,0.12)'),background:answers.lunchVeg===v?accentDark+'10':'transparent',color:answers.lunchVeg===v?accentDark:text,cursor:'pointer',fontFamily:sans,fontSize:'13px',marginBottom:'8px'}}>{v}</button>;
        })}
      </div>
    )},
    { title: 'Dinner', content: (
      <div>
        <label style={lbl}>Which dinner this week?</label>
        {['Spaghetti with meat sauce','Pork chops + candy yams + rice','Lamb + mashed potatoes + brussels sprouts','Chicken pasta (garlic butter)','Honey garlic wings + rice + broccoli','Pork chops + mashed potatoes + green beans'].map(function(v){
          return <button key={v} onClick={function(){update('dinner',v);}} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 16px',borderRadius:'10px',border:'1px solid '+(answers.dinner===v?accentDark:'rgba(93,66,51,0.12)'),background:answers.dinner===v?accentDark+'10':'transparent',color:answers.dinner===v?accentDark:text,cursor:'pointer',fontFamily:sans,fontSize:'13px',marginBottom:'8px'}}>{v}</button>;
        })}
      </div>
    )},
    { title: 'Dessert', content: (
      <div>
        <label style={lbl}>Dessert this week?</label>
        <div style={{display:'flex',gap:'8px'}}>
          {['Yes — Pillsbury cookies','No — skip dessert'].map(function(v){return <button key={v} onClick={function(){update('dessert',v);}} style={{flex:1,padding:'12px',borderRadius:'10px',border:'1px solid '+(answers.dessert===v?accentDark:'rgba(93,66,51,0.12)'),background:answers.dessert===v?accentDark+'10':'transparent',color:answers.dessert===v?accentDark:text,cursor:'pointer',fontFamily:sans,fontSize:'13px'}}>{v}</button>;})}
        </div>
      </div>
    )},
    { title: 'Pantry Check', content: (
      <div>
        <label style={lbl}>What do you already have at home? (check all that apply)</label>
        <MultiSelect options={PANTRY_ITEMS} selected={answers.pantry||[]} onChange={function(v){update('pantry',v);}} />
      </div>
    )},
    { title: 'Previous Week Feedback', content: (
      <div>
        <label style={lbl}>How did last week&apos;s sessions feel?</label>
        {['Too easy — I could have done more','About right — challenging but manageable','Too hard — I was exhausted','Mixed — some sessions fine, others weren\'t'].map(function(v){
          return <button key={v} onClick={function(){update('sessionFeel',v);}} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 16px',borderRadius:'10px',border:'1px solid '+(answers.sessionFeel===v?accentDark:'rgba(93,66,51,0.12)'),background:answers.sessionFeel===v?accentDark+'10':'transparent',color:answers.sessionFeel===v?accentDark:text,cursor:'pointer',fontFamily:sans,fontSize:'13px',marginBottom:'8px'}}>{v}</button>;
        })}
        <label style={{...lbl, marginTop:'12px'}}>Any exercises that felt too heavy or uncomfortable?</label>
        <textarea value={answers.exerciseFeedback||''} onChange={function(e){update('exerciseFeedback',e.target.value);}} placeholder="Optional — leave blank if everything felt fine" rows={2} style={{...inp,resize:'vertical'}} />
        <label style={{...lbl,marginTop:'12px'}}>How was your appetite last week?</label>
        {['Better than the week before','About the same','Worse — eating less'].map(function(v){return <button key={v} onClick={function(){update('appetite',v);}} style={{padding:'7px 14px',borderRadius:'20px',border:'1px solid '+(answers.appetite===v?accentDark:'rgba(93,66,51,0.12)'),background:answers.appetite===v?accentDark:'transparent',color:answers.appetite===v?'#fff':textSoft,cursor:'pointer',fontFamily:sans,fontSize:'12px',marginRight:'6px'}}>{v}</button>;})}
      </div>
    )},
    { title: 'Weight Check-In', content: (
      <div>
        <label style={lbl}>Saturday morning weight (after waking, after bathroom)</label>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
          <input type="number" step="0.1" value={answers.satWeight||''} onChange={function(e){update('satWeight',e.target.value);}} placeholder="e.g. 148.5" style={{...inp,width:'140px'}} />
          <span style={{fontSize:'13px',color:textSoft,fontFamily:sans}}>lbs</span>
        </div>
        <label style={lbl}>Any other weights from this week? (optional)</label>
        <textarea value={answers.weekWeights||''} onChange={function(e){update('weekWeights',e.target.value);}} placeholder="e.g. Mon 149.2, Wed 147.8" rows={2} style={{...inp,resize:'vertical'}} />
      </div>
    )},
  ];

  var lbl = { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, display: 'block', marginBottom: '8px', fontFamily: sans };

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      var res = await fetch('/api/plan-week', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      onComplete(data.plan);
    } catch (e) {
      setError(e.message);
      setGenerating(false);
    }
  }

  var currentStep = STEPS[step];
  var progress = Math.round((step / STEPS.length) * 100);

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(61,46,34,0.4)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:'#FFFFFF',borderRadius:'20px',width:'100%',maxWidth:'520px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 16px 48px rgba(61,46,34,0.15)'}}>
        <div style={{padding:'24px 28px',borderBottom:'1px solid rgba(93,66,51,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
            <p style={{fontFamily:serif,fontStyle:'italic',fontSize:'22px',color:brown}}>Plan New Week</p>
            <button onClick={onClose} style={{background:'none',border:'none',color:textMuted,fontSize:'22px',cursor:'pointer'}}>×</button>
          </div>
          <div style={{height:'4px',background:'#EDE5DA',borderRadius:'2px',overflow:'hidden'}}>
            <div style={{height:'100%',width:progress+'%',background:accentDark,borderRadius:'2px',transition:'width 0.3s'}} />
          </div>
          <p style={{fontSize:'11px',color:textMuted,marginTop:'6px',fontFamily:sans}}>{step+1} of {STEPS.length} · {currentStep.title}</p>
        </div>

        <div style={{padding:'24px 28px'}}>
          <h3 style={{fontFamily:sans,fontSize:'16px',fontWeight:600,color:brown,marginBottom:'20px'}}>{currentStep.title}</h3>
          {currentStep.content}
        </div>

        {error && <div style={{margin:'0 28px 16px',padding:'12px 16px',background:'#fff0f0',borderRadius:'8px',fontSize:'13px',color:'#b44',fontFamily:sans}}>{error}</div>}

        <div style={{padding:'16px 28px 24px',display:'flex',gap:'8px'}}>
          {step > 0 && <button onClick={function(){setStep(step-1);}} style={{padding:'11px 20px',borderRadius:'50px',border:'1px solid rgba(93,66,51,0.12)',background:'transparent',color:textSoft,cursor:'pointer',fontSize:'13px',fontFamily:sans}}>Back</button>}
          {step < STEPS.length-1
            ? <button onClick={function(){setStep(step+1);}} style={{flex:1,padding:'12px',borderRadius:'50px',border:'none',background:accentDark,color:'#fff',fontWeight:600,cursor:'pointer',fontSize:'13px',fontFamily:sans}}>Next →</button>
            : <button onClick={generate} disabled={generating} style={{flex:1,padding:'12px',borderRadius:'50px',border:'none',background:generating?'#EDE5DA':accentDark,color:generating?textMuted:'#fff',fontWeight:600,cursor:generating?'default':'pointer',fontSize:'13px',fontFamily:sans}}>
                {generating ? 'Generating your plan...' : 'Generate My Week ✦'}
              </button>
          }
        </div>
      </div>
    </div>
  );
}

export default function WellnessPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;
  var tabState = useState('Workout');
  var tab = tabState[0]; var setTab = tabState[1];
  var dayState = useState(0);
  var activeDay = dayState[0]; var setActiveDay = dayState[1];
  var checkState = useState({});
  var checked = checkState[0]; var setChecked = checkState[1];
  var planModalState = useState(false);
  var showPlanModal = planModalState[0]; var setShowPlanModal = planModalState[1];

  var currentWeek = (data && data.currentWeek) || DEFAULT_WEEK;
  var pastWeeks = (data && data.pastWeeks) || [];

  function toggleCheck(key) { setChecked(function(p){var n=Object.assign({},p);n[key]=!n[key];return n;}); }

  function onPlanComplete(newPlan) {
    var archived = Object.assign({}, currentWeek, { archivedAt: new Date().toISOString() });
    updateData(function(prev) {
      return Object.assign({}, prev, {
        currentWeek: newPlan,
        pastWeeks: [archived].concat(prev && prev.pastWeeks || []).slice(0, 12),
      });
    });
    setShowPlanModal(false);
    setTab('Workout');
    setActiveDay(0);
  }

  if (loading) return null;

  var WEEK = currentWeek;

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
          <p style={{ fontSize: '13px', color: textSoft, marginTop: '4px', fontFamily: sans }}>{WEEK.overview}</p>
          {pastWeeks.length > 0 && (
            <p style={{ fontSize: '11px', color: accent, marginTop: '6px', fontFamily: sans, fontWeight: 500 }}>{pastWeeks.length} past week{pastWeeks.length > 1 ? 's' : ''} archived</p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, background: accentDark, color: '#fff', borderRadius: '6px', padding: '4px 14px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: sans }}>{WEEK.phase}</span>
          <button onClick={function(){setShowPlanModal(true);}} style={{ padding: '10px 20px', borderRadius: '50px', border: 'none', background: '#EDE5DA', color: brown, fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: sans }}>Plan New Week ✦</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '3px', background: '#EDE5DA', borderRadius: '10px', padding: '3px', marginBottom: '18px', border: '1px solid rgba(93,66,51,0.06)', flexWrap: 'wrap' }}>
        {TABS.map(function(t) {
          var active = tab === t;
          return <button key={t} onClick={function(){setTab(t);}} style={{ flex: 1, fontFamily: sans, fontSize: '13px', fontWeight: active ? 600 : 400, padding: '10px 6px', borderRadius: '8px', border: 'none', background: active ? '#FFFFFF' : 'transparent', color: active ? brown : textSoft, cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none', minWidth: '68px', textAlign: 'center' }}>{t}</button>;
        })}
      </div>

      {/* WORKOUT */}
      {tab === 'Workout' && (
        <div>
          <div style={card}>
            <div style={cardTitle}>Week at a Glance</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead><tr>{['Day','Session','Key Focus'].map(function(h){return <th key={h} style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, textAlign: 'left', padding: '0 10px 8px 0', borderBottom: '1px solid rgba(93,66,51,0.06)', fontFamily: sans }}>{h}</th>;})}</tr></thead>
              <tbody>{WEEK.workouts.map(function(w,i){return <tr key={i}><td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', fontWeight: 600, color: brown, fontSize: '13px', fontFamily: sans }}>{w.day}</td><td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', color: text, fontFamily: sans }}>{w.label}</td><td style={{ padding: '10px 0', borderBottom: '1px solid rgba(93,66,51,0.04)', color: textSoft, fontSize: '13px', fontFamily: sans }}>{w.focus}</td></tr>;})}</tbody>
            </table>
          </div>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: '10px', fontFamily: sans }}>Day by Day</p>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {WEEK.workouts.map(function(w,i){var active=activeDay===i;return <button key={i} onClick={function(){setActiveDay(i);}} style={{ fontFamily: sans, fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '8px', border: '1.5px solid '+(active?accentDark:'rgba(93,66,51,0.1)'), background: active?accentDark:'#FFFFFF', color: active?'#fff':text, cursor: 'pointer' }}>{w.day} · {w.label.split(' ·')[0]}</button>;})}
          </div>
          {(function(){var w=WEEK.workouts[activeDay];return (
            <div>
              <div style={{...card,borderLeft:'3px solid '+accentDark}}>
                <p style={{fontFamily:sans,fontSize:'11px',fontWeight:600,color:accent,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'4px'}}>Warmup</p>
                <p style={{fontSize:'14px',color:text,fontFamily:sans}}>{w.warmup}</p>
              </div>
              <div style={card}>
                <div style={cardTitle}>Exercises</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 100px 100px',gap:'8px',padding:'0 0 8px',borderBottom:'1px solid rgba(93,66,51,0.06)',marginBottom:'4px'}}>
                  {['Exercise','Weight','Sets x Reps'].map(function(h){return <span key={h} style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:textMuted,fontFamily:sans,textAlign:h!=='Exercise'?'right':'left'}}>{h}</span>;})}
                </div>
                {w.exercises.map(function(ex,j){return (
                  <div key={j} style={{display:'grid',gridTemplateColumns:'1fr 100px 100px',gap:'8px',padding:'12px 0',borderBottom:'1px solid rgba(93,66,51,0.04)'}}>
                    <div>
                      <p style={{fontSize:'14px',fontWeight:600,color:brown,fontFamily:sans}}>{ex.name} {ex.muscle&&<span style={{fontSize:'10px',fontWeight:700,borderRadius:'4px',padding:'1px 6px',marginLeft:'6px',background:'#EDE5DA',color:text,textTransform:'uppercase',letterSpacing:'0.03em'}}>{ex.muscle}</span>}</p>
                      <p style={{fontSize:'13px',color:textSoft,marginTop:'4px',lineHeight:1.5,fontFamily:sans}}>{ex.cue}</p>
                    </div>
                    <p style={{fontSize:'14px',fontWeight:700,textAlign:'right',color:brown,fontFamily:sans}}>{ex.weight}</p>
                    <p style={{fontSize:'14px',textAlign:'right',color:text,fontFamily:sans}}>{ex.sets}</p>
                  </div>
                );})}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                <div style={{...card,borderLeft:'3px solid #5a9870'}}><p style={{fontFamily:sans,fontSize:'11px',fontWeight:600,color:'#5a9870',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'4px'}}>Post-Workout Stretches</p><p style={{fontSize:'14px',color:text,fontFamily:sans}}>{w.stretches}</p></div>
                <div style={{...card,borderLeft:'3px solid #c4903a'}}><p style={{fontFamily:sans,fontSize:'11px',fontWeight:600,color:'#c4903a',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'4px'}}>Sauna</p><p style={{fontSize:'14px',color:text,fontFamily:sans}}>{w.sauna}</p></div>
              </div>
            </div>
          );}())}
        </div>
      )}

      {/* MEALS */}
      {tab === 'Meals' && (
        <div>
          <div style={card}>
            <div style={cardTitle}>Daily Meal + Supplement Schedule</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>{['Time','What','Notes'].map(function(h){return <th key={h} style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:textMuted,textAlign:'left',padding:'0 10px 8px 0',borderBottom:'1px solid rgba(93,66,51,0.06)',fontFamily:sans}}>{h}</th>;})}</tr></thead>
              <tbody>{WEEK.meals.schedule.map(function(m,i){return <tr key={i}><td style={{padding:'10px 10px 10px 0',borderBottom:'1px solid rgba(93,66,51,0.04)',fontWeight:600,color:brown,fontSize:'13px',whiteSpace:'nowrap',fontFamily:sans}}>{m.time}</td><td style={{padding:'10px 10px 10px 0',borderBottom:'1px solid rgba(93,66,51,0.04)',color:text,fontSize:'14px',fontFamily:sans}}>{m.what}</td><td style={{padding:'10px 0',borderBottom:'1px solid rgba(93,66,51,0.04)',color:textSoft,fontSize:'13px',fontStyle:'italic',fontFamily:sans}}>{m.notes}</td></tr>;})}</tbody>
            </table>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'14px'}}>
            {[['calories','Calories'],['protein','Protein'],['carbs','Carbs'],['fat','Fat']].map(function(item){return <div key={item[0]} style={{background:'#EDE5DA',borderRadius:'12px',padding:'16px 8px',textAlign:'center',border:'1px solid rgba(93,66,51,0.06)'}}><p style={{fontSize:'24px',fontWeight:700,color:brown,fontFamily:sans}}>{WEEK.meals.macros[item[0]]}</p><p style={{fontSize:'10px',fontWeight:700,color:textMuted,marginTop:'3px',textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:sans}}>{item[1]}</p></div>;})}
          </div>
          <div style={{...card,borderLeft:'3px solid #5b7ec4'}}><p style={{fontSize:'14px',color:text,fontFamily:sans}}>{WEEK.meals.note}</p></div>
        </div>
      )}

      {/* SKIN */}
      {tab === 'Skin' && (
        <div>
          <div style={{...card,borderLeft:'3px solid '+accentDark}}><p style={{fontSize:'14px',color:text,fontFamily:sans}}>{WEEK.skin.phase}</p></div>
          {[['Morning Routine · Every Day',WEEK.skin.morning],['Post-Gym · Gym Days Only',WEEK.skin.postGym],['Evening Routine · Every Night',WEEK.skin.evening]].map(function(section){return (
            <div key={section[0]} style={card}>
              <div style={cardTitle}>{section[0]}</div>
              {section[1].map(function(s){return (
                <div key={s.step} style={{display:'flex',gap:'12px',padding:'10px 0',borderBottom:'1px solid rgba(93,66,51,0.04)',alignItems:'flex-start'}}>
                  <div style={{width:'24px',height:'24px',borderRadius:'50%',background:accentDark,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,flexShrink:0,fontFamily:sans}}>{s.step}</div>
                  <div><p style={{fontSize:'14px',fontWeight:600,color:brown,fontFamily:sans}}>{s.name}</p><p style={{fontSize:'13px',color:textSoft,marginTop:'3px',lineHeight:1.5,fontFamily:sans}}>{s.note}</p></div>
                </div>
              );})}
            </div>
          );})}
        </div>
      )}

      {/* GROCERY */}
      {tab === 'Grocery' && (
        <div>
          <div style={{...card,borderLeft:'3px solid '+accent}}><p style={{fontFamily:sans,fontSize:'12px',fontWeight:600,color:brown,marginBottom:'4px'}}>Already have — skip these</p><p style={{fontSize:'14px',color:textSoft,fontFamily:sans}}>{WEEK.grocery.have}</p></div>
          {[['Wegmans','#2A5030','#EAF0EA'],['Costco','#1A2A70','#EAECF5'],['Amazon','#7a4f1a','#EDE5DA']].map(function(store){
            var key = store[0].toLowerCase();
            var items = WEEK.grocery[key];
            return (
              <div key={store[0]}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',margin:'18px 0 6px'}}>
                  <p style={{fontSize:'16px',fontWeight:700,color:brown,fontFamily:sans}}>{store[0]}</p>
                  <span style={{fontSize:'10px',fontWeight:700,borderRadius:'4px',padding:'2px 10px',background:store[2],color:store[1],letterSpacing:'0.05em',textTransform:'uppercase'}}>{store[0]}</span>
                </div>
                <div style={card}>
                  {Array.isArray(items) && items.length > 0 && typeof items[0] === 'string' ? items.map(function(item,i){
                    var k='g-'+store[0]+'-'+i;
                    return <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'9px 0',borderBottom:'1px solid rgba(93,66,51,0.04)'}}><input type="checkbox" checked={!!checked[k]} onChange={function(){toggleCheck(k);}} style={{width:'17px',height:'17px',accentColor:accentDark,cursor:'pointer'}} /><span style={{fontSize:'15px',color:checked[k]?textMuted:text,textDecoration:checked[k]?'line-through':'none',fontFamily:sans}}>{item}</span></div>;
                  }) : Array.isArray(items) && items.map(function(group){return (
                    <div key={group.cat}>
                      <p style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:textMuted,marginBottom:'10px',marginTop:'10px',fontFamily:sans}}>{group.cat}</p>
                      {group.items.map(function(item,i){
                        var k='g-'+store[0]+'-'+group.cat+'-'+i;
                        return <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'9px 0',borderBottom:'1px solid rgba(93,66,51,0.04)'}}><input type="checkbox" checked={!!checked[k]} onChange={function(){toggleCheck(k);}} style={{width:'17px',height:'17px',accentColor:accentDark,cursor:'pointer'}} /><span style={{fontSize:'15px',color:checked[k]?textMuted:text,textDecoration:checked[k]?'line-through':'none',fontFamily:sans}}>{item}</span></div>;
                      })}
                    </div>
                  );})}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PREP */}
      {tab === 'Prep' && (
        <div>
          <div style={{...card,borderLeft:'3px solid '+accentDark}}><p style={{fontFamily:serif,fontStyle:'italic',fontSize:'18px',color:brown,marginBottom:'4px'}}>Sunday Prep · {WEEK.prep.total}</p><p style={{fontSize:'14px',color:textSoft,fontFamily:sans}}>{WEEK.prep.note}</p></div>
          <div style={card}><div style={cardTitle}>Equipment to Set Out</div><p style={{fontSize:'14px',color:text,lineHeight:1.7,fontFamily:sans}}>{WEEK.prep.equipment}</p></div>
          <div style={card}>
            <div style={cardTitle}>Step by Step</div>
            {WEEK.prep.steps.map(function(s,i){return (
              <div key={i} style={{display:'flex',gap:'14px',padding:'12px 0',borderBottom:'1px solid rgba(93,66,51,0.04)',alignItems:'flex-start'}}>
                <span style={{fontSize:'12px',fontWeight:700,color:accent,minWidth:'80px',flexShrink:0,paddingTop:'2px',fontFamily:sans}}>{s.time}</span>
                <div><p style={{fontSize:'15px',fontWeight:600,color:brown,fontFamily:sans}}>{s.title}</p><p style={{fontSize:'13px',color:textSoft,marginTop:'4px',lineHeight:1.6,fontFamily:sans}}>{s.detail}</p></div>
              </div>
            );})}
          </div>
        </div>
      )}

      {showPlanModal && <PlanNewWeekModal onClose={function(){setShowPlanModal(false);}} onComplete={onPlanComplete} />}
    </div>
  );
}
