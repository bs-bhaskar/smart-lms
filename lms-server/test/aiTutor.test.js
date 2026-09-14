const test = require('node:test');
const assert = require('node:assert/strict');
const { getStudyHelp, buildFallbackPlan } = require('../utils/aiTutor');

test('buildFallbackPlan includes prompt and context details', () => {
  const output = buildFallbackPlan('recursion', { courses: ['DSA'], nextClass: 'Monday' });
  assert.match(output, /recursion/i);
  assert.match(output, /DSA/);
  assert.match(output, /Monday/);
});

test('getStudyHelp falls back when api key is missing', async () => {
  const original = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  const result = await getStudyHelp({ prompt: 'sorting', context: { courses: ['Algo'] } });
  assert.equal(result.source, 'fallback');
  assert.ok(result.answer.length > 0);

  process.env.OPENAI_API_KEY = original;
});
