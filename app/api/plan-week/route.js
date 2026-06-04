import { NextResponse } from 'next/server';
import { AP_WEEKLY_PLANNING_LOGIC } from '@/lib/wellness-logic';

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const answers = await request.json();

    const systemPrompt = `You are the wellness planning assistant for Booked & Paiged, a personal dashboard app. You generate complete weekly wellness plans based on the user's answers to a planning questionnaire.

${AP_WEEKLY_PLANNING_LOGIC}

CRITICAL: Respond with ONLY a valid JSON object. No preamble, no explanation, no markdown fences. The JSON must match this exact structure:

{
  "title": "Week of [dates]",
  "phase": "[cycle phase description]",
  "overview": "[1-2 sentence overview of the week]",
  "workouts": [
    {
      "day": "Mon",
      "label": "[muscle group] · [intensity]",
      "focus": "[2-3 key exercises]",
      "exercises": [
        { "name": "[exercise name]", "muscle": "[muscle tag]", "weight": "[weight or bodyweight]", "sets": "[sets x reps]", "cue": "[coaching cue]" }
      ],
      "warmup": "[warmup description]",
      "stretches": "[post-workout stretches]",
      "sauna": "[sauna time]"
    }
  ],
  "meals": {
    "schedule": [
      { "time": "[time]", "what": "[food/supplement]", "notes": "[notes including macros if relevant]" }
    ],
    "macros": { "calories": "[number]", "protein": "[Xg]", "carbs": "[Xg]", "fat": "[Xg]" },
    "note": "[hydration and medication note]"
  },
  "skin": {
    "phase": "[cycle phase skincare note]",
    "morning": [{ "step": 1, "name": "[product]", "note": "[instruction]" }],
    "postGym": [{ "step": 1, "name": "[product]", "note": "[instruction]" }],
    "evening": [{ "step": 1, "name": "[product]", "note": "[instruction]" }]
  },
  "grocery": {
    "wegmans": [{ "cat": "[category]", "items": ["[item]"] }],
    "costco": ["[item]"],
    "amazon": ["[item]"],
    "have": "[items already on hand]"
  },
  "prep": {
    "total": "[time estimate]",
    "note": "[overview note]",
    "equipment": "[equipment list]",
    "steps": [{ "time": "[time block]", "title": "[step title]", "detail": "[detailed instructions]" }]
  }
}`;

    const userMessage = `Here are my answers for this week's plan:

${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join('\n')}

Please generate my complete weekly wellness plan.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: 'Claude API error: ' + err }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.content[0].text.trim();

    // Strip any accidental markdown fences
    const clean = raw.replace(/^```json\n?/,'').replace(/\n?```$/,'').trim();
    const plan = JSON.parse(clean);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Plan week error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
