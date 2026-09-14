const Groq = require('groq-sdk');

async function getStudyHelp({ prompt, context }) {
  const fallbackAnswer = buildFallbackPlan(prompt, context);

  try {
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const courses = (context.courses || []).join(', ') || 'your courses';
    const nextClass = context.nextClass || 'your next class';

    const response = await client.chat.completions.create({
      // model: 'llama-3.3-70b-versatile',//Groq ne August 16, 2026 ko deprecate/shutdown kar diya hai free/developer usage ke liye. Groq ab openai/gpt-oss-120b ya qwen/qwen3.6-27b recommend karta hai.
      model: 'openai/gpt-oss-120b',//thats why we are using this model now
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `You are a helpful study assistant.
Courses: ${courses}
Next class: ${nextClass}
Question: ${prompt}
Give a clear simple answer.`,
        },
      ],
    });

    return { source: 'ai', answer: response.choices[0].message.content };

  } catch (err) {
    console.error('Groq error:', err.message);
    return { source: 'fallback', answer: fallbackAnswer };
  }
}

function buildFallbackPlan(prompt, context) {
  const courses = (context.courses || []).slice(0, 3).join(', ') || 'your courses';
  const nextClass = context.nextClass || 'your next class';
  return `Study "${prompt}" for 25 minutes from ${courses}. Review notes before ${nextClass}, then practice 5 questions.`;
}

module.exports = { getStudyHelp };