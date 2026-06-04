'use client';

import { useState, useEffect, useCallback } from 'react';
import { useData } from '../components/DataProvider';

var serif = "'Cormorant Garamond', Georgia, serif";
var sans = "'Satoshi', -apple-system, sans-serif";

var C = {
  bg: '#F6F1EB', surface: '#FFFFFF', border: 'rgba(93,66,51,0.08)',
  borderHover: 'rgba(156,123,101,0.3)',
  text: '#5D4233', textSoft: 'rgba(93,66,51,0.55)',
  textMuted: 'rgba(93,66,51,0.35)', accent: '#9C7B65',
  accentLight: 'rgba(156,123,101,0.08)', accentDark: '#6B4F3E',
  brown: '#8B6E5A',
};

var CAT_COLORS = {
  "Physical Wellness": "#5a9870", "GRE / Grad School": "#5b7ec4",
  "Awards": "#c4903a", "Sachs Media": "#3a8fa8",
  "ICartSwag": "#c4604a", "Volunteer": "#6e9e50",
  "Self Care": "#b86880", "Medical": "#8060b8",
};
var CATEGORIES = Object.keys(CAT_COLORS);
var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var DAYS_S = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var DAYS_F = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function fmtDate(d) { return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function parseDate(s) { var p=s.split('-').map(Number); return new Date(p[0],p[1]-1,p[2]); }
function fmtTime(t) { if(!t)return''; var p=t.split(':').map(Number); return (p[0]%12||12)+':'+String(p[1]).padStart(2,'0')+(p[0]>=12?'pm':'am'); }
var _n=400; function uid(){return 'ev'+(++_n)+'_'+Date.now();}
function cc(cat){return CAT_COLORS[cat]||C.accent;}
function sortEvs(arr){return arr.slice().sort(function(a,b){if(!a.startTime&&!b.startTime)return 0;if(!a.startTime)return 1;if(!b.startTime)return -1;return a.startTime.localeCompare(b.startTime);});}

var DEFAULTS = [
  {id:'d01',title:"Adderall",startDate:"2026-01-01",startTime:"04:15",endTime:"04:20",category:"Medical",notes:"20-25mg. Weekdays only.",recurrence:{type:'daily',days:[1,2,3,4,5],until:null}},
  {id:'d02',title:"Spironolactone 100mg",startDate:"2026-01-01",startTime:"12:30",endTime:"12:35",category:"Medical",notes:"Take with lunch.",recurrence:{type:'daily',days:null,until:null}},
  {id:'d03',title:"Ritual Essential Vitamin",startDate:"2026-01-01",startTime:"07:10",endTime:"07:15",category:"Medical",notes:"Take with morning smoothie.",recurrence:{type:'daily',days:null,until:null}},
  {id:'d04',title:"Vitamin D",startDate:"2026-01-02",startTime:"09:00",endTime:"09:05",category:"Medical",notes:"Weekly Friday dose.",recurrence:{type:'weekly',days:[5],until:null}},
  {id:'d05',title:"Therapy Session",startDate:"2026-01-01",startTime:"18:00",endTime:"19:00",category:"Medical",notes:"Weekly Thursday.",recurrence:{type:'weekly',days:[4],until:null}},
  {id:'d06',title:"Medication Management",startDate:"2026-05-05",startTime:"10:00",endTime:"11:00",category:"Medical",notes:"Monthly check-in.",recurrence:{type:'monthly',days:null,until:null}},
  {id:'d07',title:"Workout + Sauna",startDate:"2026-01-05",startTime:"05:30",endTime:"07:00",category:"Physical Wellness",notes:"Mon-Thu. Gym + 15 min sauna.",recurrence:{type:'weekly',days:[1,2,3,4],until:null}},
  {id:'d08',title:"Morning Smoothie",startDate:"2026-01-01",startTime:"07:00",endTime:"07:15",category:"Physical Wellness",notes:"Frozen berries, Coffee Mate, Oikos Pro, avocado, creatine.",recurrence:{type:'daily',days:null,until:null}},
  {id:'d09',title:"Afternoon Protein Snack",startDate:"2026-01-01",startTime:"15:30",endTime:"15:40",category:"Physical Wellness",notes:"Oikos Salted Caramel Protein Shake.",recurrence:{type:'daily',days:null,until:null}},
  {id:'d10',title:"Meal Prep",startDate:"2026-01-04",startTime:"11:00",endTime:"14:00",category:"Physical Wellness",notes:"Prep meals for the week.",recurrence:{type:'weekly',days:[0],until:null}},
  {id:'d11',title:"Skincare Routine",startDate:"2026-01-05",startTime:"21:00",endTime:"21:15",category:"Physical Wellness",notes:"Azelaic acid + Gua sha. Mon/Wed/Fri.",recurrence:{type:'weekly',days:[1,3,5],until:null}},
  {id:'d12',title:"Morning Affirmations",startDate:"2026-01-01",startTime:"05:00",endTime:"05:15",category:"Self Care",notes:"Mirror affirmations and gratitude journal.",recurrence:{type:'daily',days:null,until:null}},
  {id:'d13',title:"Monthly Massage",startDate:"2026-05-03",startTime:"12:00",endTime:"14:00",category:"Self Care",notes:"Monthly self-care.",recurrence:{type:'monthly',days:null,until:null}},
  {id:'d16',title:"ICartSwag: Content + Strategy",startDate:"2026-01-06",startTime:"19:00",endTime:"20:00",category:"ICartSwag",notes:"Social content, brand strategy. Tuesdays.",recurrence:{type:'weekly',days:[2],until:null}},
  {id:'d17',title:"GRE Study Block",startDate:"2026-01-05",startTime:"20:00",endTime:"21:30",category:"GRE / Grad School",notes:"Verbal + Quant prep. Target: 160+ per section.",recurrence:{type:'weekly',days:[1,3,5],until:null}},
  {id:'d19',title:"Awards Work Block",startDate:"2026-05-18",startTime:"19:00",endTime:"20:30",category:"Awards",notes:"Weekly Mondays.",recurrence:{type:'weekly',days:[1],until:null}},
  {id:'sm01',title:"HCA Social Posts",startDate:"2026-01-05",startTime:"09:00",endTime:"10:30",category:"Sachs Media",notes:"Weekly Monday task block.",recurrence:{type:'weekly',days:[1],until:null}},
  {id:'sm02',title:"Team Health TB",startDate:"2026-01-05",startTime:"10:30",endTime:"11:00",category:"Sachs Media",notes:"Weekly Monday internal check-in.",recurrence:{type:'weekly',days:[1],until:null}},
  {id:'sm03',title:"HCA/SM Weekly Check-In",startDate:"2026-01-05",startTime:"13:00",endTime:"14:00",category:"Sachs Media",notes:"Weekly Monday HCA client check-in.",recurrence:{type:'weekly',days:[1],until:null}},
  {id:'sm04',title:"Finalize HCA Intelligence Report",startDate:"2026-01-05",startTime:"15:00",endTime:"17:00",category:"Sachs Media",notes:"Weekly Monday delivery.",recurrence:{type:'weekly',days:[1],until:null}},
  {id:'sm05',title:"Start New HCA Clips",startDate:"2026-01-06",startTime:"09:00",endTime:"10:00",category:"Sachs Media",notes:"Weekly Tuesday.",recurrence:{type:'weekly',days:[2],until:null}},
  {id:'sm06',title:"SachsHEALTH Team Call",startDate:"2026-01-06",startTime:"10:30",endTime:"11:00",category:"Sachs Media",notes:"Weekly Tuesday. Zoom.",recurrence:{type:'weekly',days:[2],until:null}},
  {id:'sm08',title:"Paige / Torri Check-In",startDate:"2026-01-06",startTime:"11:30",endTime:"12:30",category:"Sachs Media",notes:"Weekly Tuesday 1:1.",recurrence:{type:'weekly',days:[2],until:null}},
  {id:'sm11',title:"Clips Research - HCA",startDate:"2026-01-06",startTime:"14:30",endTime:"16:00",category:"Sachs Media",notes:"Daily clips research.",recurrence:{type:'weekly',days:[2,3,4,5],until:null}},
  {id:'sm13',title:"Send HCA Intelligence Report",startDate:"2026-01-06",startTime:"16:00",endTime:"17:00",category:"Sachs Media",notes:"Weekly Tuesday delivery.",recurrence:{type:'weekly',days:[2],until:null}},
  {id:'sm15',title:"HCA Team Chat",startDate:"2026-01-07",startTime:"13:00",endTime:"13:30",category:"Sachs Media",notes:"Wednesday internal check-in.",recurrence:{type:'weekly',days:[3],until:null}},
  {id:'sm16',title:"HCA/SM Weekly Check-In 2",startDate:"2026-01-07",startTime:"13:30",endTime:"14:00",category:"Sachs Media",notes:"Wednesday HCA client check-in.",recurrence:{type:'weekly',days:[3],until:null}},
  {id:'sm18',title:"Staff Meeting",startDate:"2026-01-08",startTime:"08:30",endTime:"09:30",category:"Sachs Media",notes:"Weekly Thursday all-hands.",recurrence:{type:'weekly',days:[4],until:null}},
  {id:'sm19',title:"HCA Team Chat Thu",startDate:"2026-01-08",startTime:"10:30",endTime:"11:00",category:"Sachs Media",notes:"Thursday HCA team check-in.",recurrence:{type:'weekly',days:[4],until:null}},
];

function EventModal(props) {
  var form=props.form, setForm=props.setForm, onSave=props.onSave, onDelete=props.onDelete, onClose=props.onClose, isEdit=props.isEdit;
  var DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function toggleDay(i){setForm(function(f){return Object.assign({},f,{recurrenceDays:f.recurrenceDays.includes(i)?f.recurrenceDays.filter(function(d){return d!==i;}):f.recurrenceDays.concat([i])});});}
  var inputSt={width:'100%',padding:'10px 14px',borderRadius:'10px',border:'1px solid '+C.border,background:C.bg,color:C.text,fontSize:'13px',fontFamily:sans,outline:'none'};
  var labelSt={display:'block',fontSize:'10px',letterSpacing:'0.1em',textTransform:'uppercase',color:C.brown,marginBottom:'5px',marginTop:'16px',fontFamily:sans,fontWeight:600};
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(61,46,34,0.3)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:C.surface,border:'1px solid '+C.border,borderRadius:'20px',width:'100%',maxWidth:'460px',maxHeight:'90vh',overflowY:'auto',padding:'32px',boxShadow:'0 12px 48px rgba(61,46,34,0.12)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <h3 style={{fontSize:'20px',fontFamily:serif,fontStyle:'italic',color:C.text}}>{isEdit?'Edit Event':'New Event'}</h3>
          <button onClick={onClose} style={{background:'none',border:'none',color:C.textMuted,fontSize:'24px',cursor:'pointer'}}>x</button>
        </div>
        <label style={labelSt}>Title</label>
        <input value={form.title} onChange={function(e){setForm(function(f){return Object.assign({},f,{title:e.target.value});});}} style={inputSt} placeholder="Event name" />
        <label style={labelSt}>Category</label>
        <select value={form.category} onChange={function(e){setForm(function(f){return Object.assign({},f,{category:e.target.value});});}} style={inputSt}>
          {CATEGORIES.map(function(c){return <option key={c} value={c}>{c}</option>;})}
        </select>
        <label style={labelSt}>Date</label>
        <input type="date" value={form.startDate} onChange={function(e){setForm(function(f){return Object.assign({},f,{startDate:e.target.value});});}} style={inputSt} />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <div><label style={labelSt}>Start Time</label><input type="time" value={form.startTime} onChange={function(e){setForm(function(f){return Object.assign({},f,{startTime:e.target.value});});}} style={inputSt} /></div>
          <div><label style={labelSt}>End Time</label><input type="time" value={form.endTime} onChange={function(e){setForm(function(f){return Object.assign({},f,{endTime:e.target.value});});}} style={inputSt} /></div>
        </div>
        <label style={labelSt}>Repeat</label>
        <select value={form.recurrenceType} onChange={function(e){setForm(function(f){return Object.assign({},f,{recurrenceType:e.target.value,recurrenceDays:[]});});}} style={inputSt}>
          <option value="none">Does not repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly (same date)</option>
        </select>
        {(form.recurrenceType==='daily'||form.recurrenceType==='weekly') && (
          <div style={{marginTop:'10px'}}>
            <label style={labelSt}>On these days</label>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {DN.map(function(d,i){return (
                <button key={d} onClick={function(){toggleDay(i);}} style={{padding:'6px 12px',borderRadius:'20px',fontSize:'11px',cursor:'pointer',border:'1px solid '+(form.recurrenceDays.includes(i)?C.accent:C.border),background:form.recurrenceDays.includes(i)?C.accentLight:'transparent',color:form.recurrenceDays.includes(i)?C.accent:C.textSoft,fontFamily:sans}}>{d}</button>
              );})}
            </div>
          </div>
        )}
        <label style={labelSt}>Notes</label>
        <textarea value={form.notes} onChange={function(e){setForm(function(f){return Object.assign({},f,{notes:e.target.value});});}} style={Object.assign({},inputSt,{height:'80px',resize:'vertical'})} placeholder="Optional..." />
        <div style={{display:'flex',gap:'8px',marginTop:'24px'}}>
          <button onClick={onSave} style={{flex:1,padding:'12px',borderRadius:'50px',border:'none',background:C.accentDark,color:'#fff',fontWeight:600,cursor:'pointer',fontSize:'13px',fontFamily:sans}}>{isEdit?'Save Changes':'Add Event'}</button>
          {isEdit && <button onClick={onDelete} style={{padding:'12px 18px',borderRadius:'50px',border:'1px solid '+C.border,background:'transparent',color:C.textSoft,cursor:'pointer',fontSize:'13px',fontFamily:sans}}>Delete</button>}
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  var dataCtx = useData();
  var data = dataCtx.data;
  var updateData = dataCtx.updateData;
  var loading = dataCtx.loading;

  var TODAY = fmtDate(new Date());
  var currentDateState = useState(new Date());
  var currentDate = currentDateState[0];
  var setCurrentDate = currentDateState[1];
  var viewState = useState('month');
  var view = viewState[0];
  var setView = viewState[1];
  var activeCatState = useState(CATEGORIES.slice());
  var activeCategories = activeCatState[0];
  var setActiveCategories = activeCatState[1];
  var modalState = useState(false);
  var showModal = modalState[0];
  var setShowModal = modalState[1];
  var selEvState = useState(null);
  var selectedEvent = selEvState[0];
  var setSelectedEvent = selEvState[1];
  var dayPanelState = useState(null);
  var dayPanel = dayPanelState[0];
  var setDayPanel = dayPanelState[1];
  var formState = useState({title:'',startDate:TODAY,startTime:'',endTime:'',category:'Self Care',notes:'',recurrenceType:'none',recurrenceDays:[]});
  var form = formState[0];
  var setForm = formState[1];

  var events = (data && data.calendarEvents) || DEFAULTS;

  function saveEvents(newEvents) {
    updateData(function(prev) { return Object.assign({}, prev, { calendarEvents: newEvents }); });
  }

  var getEventsForDate = useCallback(function(dateStr) {
    var date = parseDate(dateStr);
    var dow = date.getDay();
    var dom = date.getDate();
    return events.filter(function(ev) {
      if (ev.multiDay && ev.endDate) return dateStr >= ev.startDate && dateStr <= ev.endDate;
      if (!ev.recurrence) return ev.startDate === dateStr;
      if (dateStr < ev.startDate) return false;
      if (ev.recurrence.until && dateStr > ev.recurrence.until) return false;
      var type = ev.recurrence.type;
      var days = ev.recurrence.days;
      if (type === 'daily') return !days || days.includes(dow);
      if (type === 'weekly') return days && days.includes(dow);
      if (type === 'monthly') return parseDate(ev.startDate).getDate() === dom;
      return false;
    });
  }, [events]);

  var getFiltered = useCallback(function(dateStr) {
    return getEventsForDate(dateStr).filter(function(e) { return activeCategories.includes(e.category); });
  }, [getEventsForDate, activeCategories]);

  function nav(dir) {
    setCurrentDate(function(d) {
      var nd = new Date(d);
      if (view === 'month') nd.setMonth(d.getMonth() + dir);
      else if (view === 'week') nd.setDate(d.getDate() + dir * 7);
      else nd.setDate(d.getDate() + dir);
      return nd;
    });
  }

  var y = currentDate.getFullYear();
  var m = currentDate.getMonth();
  var firstDay = new Date(y, m, 1).getDay();
  var daysInMonth = new Date(y, m + 1, 0).getDate();

  var monthDays = [];
  for (var i = 0; i < firstDay; i++) monthDays.push({ date: new Date(y, m, -(firstDay - i - 1)), current: false });
  for (var i2 = 1; i2 <= daysInMonth; i2++) monthDays.push({ date: new Date(y, m, i2), current: true });
  var rem = 42 - monthDays.length;
  for (var i3 = 1; i3 <= rem; i3++) monthDays.push({ date: new Date(y, m + 1, i3), current: false });

  var weekDays = [];
  var dow = currentDate.getDay();
  for (var i4 = 0; i4 < 7; i4++) { var wd = new Date(currentDate); wd.setDate(currentDate.getDate() - dow + i4); weekDays.push(wd); }

  var headerTitle = view === 'month' ? MONTHS[m] + ' ' + y : view === 'week' ? MONTHS[weekDays[0].getMonth()] + ' ' + weekDays[0].getDate() + ' - ' + weekDays[6].getDate() + ', ' + y : DAYS_F[currentDate.getDay()] + ', ' + MONTHS[m] + ' ' + currentDate.getDate();

  function openAdd(dateStr) {
    setForm({ title: '', startDate: dateStr || TODAY, startTime: '', endTime: '', category: 'Self Care', notes: '', recurrenceType: 'none', recurrenceDays: [] });
    setSelectedEvent(null);
    setShowModal(true);
  }

  function openEdit(ev) {
    setForm({ title: ev.title, startDate: ev.startDate, startTime: ev.startTime || '', endTime: ev.endTime || '', category: ev.category, notes: ev.notes || '', recurrenceType: ev.recurrence ? ev.recurrence.type : 'none', recurrenceDays: ev.recurrence ? (ev.recurrence.days || []) : [] });
    setSelectedEvent(ev);
    setShowModal(true);
  }

  function saveEvent() {
    if (!form.title || !form.startDate) return;
    var rec = form.recurrenceType === 'none' ? null : { type: form.recurrenceType, days: form.recurrenceDays.length ? form.recurrenceDays : null, until: null };
    var ev = { id: selectedEvent ? selectedEvent.id : uid(), title: form.title, startDate: form.startDate, startTime: form.startTime || null, endTime: form.endTime || null, category: form.category, notes: form.notes, recurrence: rec };
    var newEvents = selectedEvent ? events.map(function(e) { return e.id === selectedEvent.id ? ev : e; }) : events.concat([ev]);
    saveEvents(newEvents);
    setShowModal(false);
  }

  function deleteEvent() {
    if (selectedEvent) saveEvents(events.filter(function(e) { return e.id !== selectedEvent.id; }));
    setShowModal(false);
  }

  function toggleCat(c) {
    setActiveCategories(function(prev) { return prev.includes(c) ? prev.filter(function(x) { return x !== c; }) : prev.concat([c]); });
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><p style={{ color: C.textSoft, fontFamily: serif, fontStyle: 'italic', fontSize: '18px' }}>Loading planner...</p></div>;

  return (
    <div>
      <div className="module-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
          Planner
        </h1>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', letterSpacing: '0.03em' }}>Your unified calendar across all modules</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={function(){nav(-1);}} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid ' + C.border, background: 'transparent', color: C.textSoft, cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans }}>&#8249;</button>
          <button onClick={function(){nav(1);}} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid ' + C.border, background: 'transparent', color: C.textSoft, cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans }}>&#8250;</button>
          <h2 style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '24px', color: C.text, minWidth: '200px' }}>{headerTitle}</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {['month', 'week', 'today'].map(function(v) {
            var label = v === 'today' ? 'Day' : v.charAt(0).toUpperCase() + v.slice(1);
            return <button key={v} onClick={function(){setView(v);}} style={{ padding: '7px 18px', borderRadius: '50px', border: view === v ? 'none' : '1px solid ' + C.border, background: view === v ? C.accentDark : 'transparent', color: view === v ? '#fff' : C.textSoft, fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: sans }}>{label}</button>;
          })}
          <button onClick={function(){setCurrentDate(new Date());setView('today');}} style={{ padding: '7px 18px', borderRadius: '50px', border: '1px solid ' + C.border, background: 'transparent', color: C.textSoft, fontSize: '12px', cursor: 'pointer', fontFamily: sans, marginLeft: '4px' }}>Today</button>
          <button onClick={function(){openAdd();}} style={{ padding: '7px 18px', borderRadius: '50px', border: 'none', background: C.accentDark, color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: sans, marginLeft: '4px' }}>+ New Event</button>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {CATEGORIES.map(function(cat) {
          var active = activeCategories.includes(cat);
          var color = cc(cat);
          return <button key={cat} onClick={function(){toggleCat(cat);}} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', border: '1px solid ' + (active ? color + '40' : C.border), background: active ? color + '10' : 'transparent', cursor: 'pointer', fontFamily: sans, fontSize: '11px', color: active ? C.text : C.textMuted, fontWeight: active ? 500 : 400 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? color : C.textMuted }} />
            {cat}
          </button>;
        })}
      </div>

      {/* Calendar body */}
      <div style={{ background: C.surface, border: '1px solid ' + C.border, borderRadius: '16px', boxShadow: '0 1px 4px rgba(93,66,51,0.03)', overflow: 'hidden', display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {view === 'month' && (
            <div style={{ padding: '20px 24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '6px' }}>
                {DAYS_S.map(function(d) { return <div key={d} style={{ textAlign: 'center', fontSize: '10px', letterSpacing: '0.14em', color: C.textMuted, textTransform: 'uppercase', padding: '4px 0', fontFamily: sans, fontWeight: 600 }}>{d}</div>; })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
                {monthDays.map(function(item, idx) {
                  var ds = fmtDate(item.date);
                  var evs = sortEvs(getFiltered(ds));
                  var isToday = ds === TODAY;
                  var visible = evs.slice(0, 2);
                  var overflow = evs.length - visible.length;
                  return (
                    <div key={idx} onClick={function(){setDayPanel(ds);}} style={{
                      background: isToday ? C.accentLight : C.surface,
                      border: '1px solid ' + (isToday ? C.borderHover : C.border),
                      borderRadius: '8px', padding: '6px 5px 5px',
                      opacity: item.current ? 1 : 0.25, cursor: 'pointer',
                      minHeight: '80px', display: 'flex', flexDirection: 'column',
                    }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', marginBottom: '4px', background: isToday ? C.accentDark : 'transparent', color: isToday ? '#fff' : C.text, fontSize: '12px', fontWeight: isToday ? 600 : 400, fontFamily: sans }}>{item.date.getDate()}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {visible.map(function(ev) {
                          return (
                            <div key={ev.id} onClick={function(e){e.stopPropagation();openEdit(ev);}} style={{
                              display: 'flex', alignItems: 'center', gap: '4px',
                              padding: '2px 4px', borderRadius: '4px',
                              background: cc(ev.category) + '14',
                              borderLeft: '2px solid ' + cc(ev.category),
                              cursor: 'pointer', overflow: 'hidden',
                            }}>
                              <span style={{ fontSize: '10px', color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3, fontFamily: sans }}>
                                {ev.startTime && <span style={{ color: cc(ev.category), fontWeight: 500, marginRight: '3px' }}>{fmtTime(ev.startTime)}</span>}
                                {ev.title}
                              </span>
                            </div>
                          );
                        })}
                        {overflow > 0 && <div style={{ fontSize: '10px', color: C.textMuted, padding: '1px 4px', fontFamily: sans }}>+{overflow} more</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'week' && (
            <div style={{ padding: '20px 24px', overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(130px,1fr))', gap: '6px', minWidth: '910px' }}>
                {weekDays.map(function(d) {
                  var ds = fmtDate(d);
                  var evs = sortEvs(getFiltered(ds));
                  var isToday = ds === TODAY;
                  return (
                    <div key={ds} style={{ background: C.surface, borderRadius: '10px', border: '1px solid ' + (isToday ? C.borderHover : C.border), overflow: 'hidden' }}>
                      <div style={{ padding: '9px 8px', textAlign: 'center', borderBottom: '1px solid ' + C.border, background: isToday ? C.accentLight : 'transparent' }}>
                        <p style={{ fontSize: '10px', color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: sans, fontWeight: 600 }}>{DAYS_S[d.getDay()]}</p>
                        <div style={{ width: '27px', height: '27px', borderRadius: '50%', background: isToday ? C.accentDark : 'transparent', color: isToday ? '#fff' : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: isToday ? 600 : 400, margin: '3px auto 0', fontFamily: sans }}>{d.getDate()}</div>
                      </div>
                      <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {evs.map(function(ev) {
                          return (
                            <div key={ev.id} onClick={function(){openEdit(ev);}} style={{ padding: '4px 6px', borderRadius: '4px', borderLeft: '2px solid ' + cc(ev.category), background: cc(ev.category) + '12', cursor: 'pointer' }}>
                              {ev.startTime && <p style={{ fontSize: '9px', color: cc(ev.category), fontWeight: 500, lineHeight: 1.2, marginBottom: '1px', fontFamily: sans }}>{fmtTime(ev.startTime)}</p>}
                              <p style={{ fontSize: '11px', color: C.text, lineHeight: 1.25, fontFamily: sans }}>{ev.title}</p>
                            </div>
                          );
                        })}
                        {evs.length === 0 && <p style={{ fontSize: '11px', color: C.textMuted, textAlign: 'center', padding: '10px 0' }}>-</p>}
                        <button onClick={function(){openAdd(ds);}} style={{ width: '100%', marginTop: '4px', padding: '4px', borderRadius: '4px', border: '1px dashed ' + C.border, background: 'transparent', color: C.textMuted, cursor: 'pointer', fontSize: '10px', fontFamily: sans }}>+ Add</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'today' && (function() {
            var ds = fmtDate(currentDate);
            var evs = sortEvs(getFiltered(ds));
            var d = currentDate;
            return (
              <div style={{ padding: '32px 28px', maxWidth: '620px', margin: '0 auto' }}>
                <div style={{ marginBottom: '28px' }}>
                  <p style={{ fontSize: '36px', fontFamily: serif, fontStyle: 'italic', color: C.text, lineHeight: 1 }}>{DAYS_F[d.getDay()]}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                    <p style={{ color: C.textSoft, fontSize: '14px', fontFamily: sans }}>{MONTHS[d.getMonth()]} {d.getDate()}, {d.getFullYear()}</p>
                    {ds === TODAY && <span style={{ padding: '2px 10px', borderRadius: '20px', background: C.accentLight, color: C.accent, fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', fontFamily: sans }}>TODAY</span>}
                  </div>
                </div>
                <button onClick={function(){openAdd(ds);}} style={{ marginBottom: '20px', padding: '9px 18px', borderRadius: '50px', border: '1px solid ' + C.border, background: 'transparent', color: C.textSoft, cursor: 'pointer', fontSize: '12px', fontFamily: sans }}>+ Add event</button>
                {evs.length === 0
                  ? <p style={{ color: C.textMuted, fontSize: '14px', fontFamily: sans }}>Nothing scheduled for this day.</p>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {evs.map(function(ev) {
                        return (
                          <div key={ev.id} onClick={function(){openEdit(ev);}} style={{ display: 'flex', gap: '14px', padding: '14px 16px', borderRadius: '12px', background: C.surface, border: '1px solid ' + C.border, cursor: 'pointer' }}>
                            <div style={{ width: '3px', borderRadius: '2px', flexShrink: 0, background: cc(ev.category), alignSelf: 'stretch', minHeight: '44px' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <p style={{ fontSize: '14px', fontWeight: 500, color: C.text, fontFamily: sans }}>{ev.title}</p>
                                {ev.startTime && <span style={{ fontSize: '11px', color: cc(ev.category), flexShrink: 0, fontWeight: 500, fontFamily: sans }}>{fmtTime(ev.startTime)}{ev.endTime ? ' - ' + fmtTime(ev.endTime) : ''}</span>}
                              </div>
                              <p style={{ fontSize: '10px', color: cc(ev.category), marginTop: '3px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, fontFamily: sans }}>{ev.category}</p>
                              {ev.notes && <p style={{ fontSize: '12px', color: C.textSoft, marginTop: '6px', lineHeight: 1.5, fontFamily: sans }}>{ev.notes.length > 120 ? ev.notes.slice(0, 120) + '...' : ev.notes}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                }
              </div>
            );
          })()}
        </div>

        {/* Day panel */}
        {dayPanel && (function() {
          var d = parseDate(dayPanel);
          var evs = sortEvs(getFiltered(dayPanel));
          return (
            <div style={{ width: '290px', minWidth: '290px', background: C.surface, borderLeft: '1px solid ' + C.border, display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid ' + C.border, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '32px', fontFamily: serif, fontStyle: 'italic', color: C.text, lineHeight: 1 }}>{d.getDate()}</p>
                  <p style={{ fontSize: '12px', color: C.textSoft, marginTop: '5px', fontFamily: sans }}>{DAYS_F[d.getDay()]} · {MONTHS[d.getMonth()]}</p>
                </div>
                <button onClick={function(){setDayPanel(null);}} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: '20px', cursor: 'pointer' }}>x</button>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <button onClick={function(){openAdd(dayPanel);}} style={{ width: '100%', marginBottom: '14px', padding: '8px', borderRadius: '50px', border: '1px dashed ' + C.border, background: 'transparent', color: C.textMuted, cursor: 'pointer', fontSize: '12px', fontFamily: sans }}>+ Add event</button>
                {evs.length === 0
                  ? <p style={{ color: C.textMuted, fontSize: '13px', textAlign: 'center', paddingTop: '12px', fontFamily: sans }}>Nothing scheduled.</p>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {evs.map(function(ev) {
                        return (
                          <div key={ev.id} onClick={function(){openEdit(ev);}} style={{ padding: '10px 12px', borderRadius: '10px', background: cc(ev.category) + '0d', border: '1px solid ' + cc(ev.category) + '25', cursor: 'pointer', borderLeft: '3px solid ' + cc(ev.category) }}>
                            <p style={{ fontSize: '13px', fontWeight: 500, color: C.text, fontFamily: sans }}>{ev.title}</p>
                            {ev.startTime && <p style={{ fontSize: '11px', color: cc(ev.category), marginTop: '2px', fontFamily: sans }}>{fmtTime(ev.startTime)}{ev.endTime ? ' - ' + fmtTime(ev.endTime) : ''}</p>}
                            <p style={{ fontSize: '10px', color: C.textMuted, marginTop: '2px', fontFamily: sans }}>{ev.category}</p>
                          </div>
                        );
                      })}
                    </div>
                }
              </div>
            </div>
          );
        })()}
      </div>

      {showModal && <EventModal form={form} setForm={setForm} onSave={saveEvent} onDelete={deleteEvent} onClose={function(){setShowModal(false);}} isEdit={!!selectedEvent} />}
    </div>
  );
}
