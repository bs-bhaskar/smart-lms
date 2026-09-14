const Groq = require('groq-sdk');

async function getStudyHelp({ prompt, context = {}, history = [] }) {
  const fallbackAnswer = buildFallbackPlan(prompt, context);

  try {
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const courses =
      (context.courses || []).join(', ') || 'your courses';

    const nextClass =
      context.nextClass || 'your next class';

    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI Study Assistant for a student.

Student's courses: ${courses}
Next class: ${nextClass}

Your job is to:
- Explain concepts in simple language.
- Understand follow-up questions using the previous conversation.
- Give practical study guidance.
- Use examples when helpful.
- Answer in Hinglish if the student asks in Hinglish.
- Answer in English if the student asks in English.

Formatting rules:
- Use Markdown when useful.
- Use headings with ## or ###.
- Use **bold** for important words.
- Use bullet points and numbered lists where useful.
- Use code blocks for programming code.
- Do NOT add unnecessary punctuation.
- Do NOT put Markdown symbols inside normal sentences unnecessarily.
- Keep answers clear, readable and student-friendly.`,
      },

      // Previous conversation
      ...history
        .filter(
          (message) =>
            message &&
            (message.role === 'user' || message.role === 'assistant') &&
            typeof message.content === 'string'
        )
        .slice(-10),

      // Current question
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      max_tokens: 700,
      messages,
    });

    return {
      source: 'ai',
      answer:
        response.choices?.[0]?.message?.content ||
        'Sorry, I could not generate a response.',
    };

  } catch (err) {
    console.error('Groq error:', err.message);

    return {
      source: 'fallback',
      answer: fallbackAnswer,
    };
  }
}

function buildFallbackPlan(prompt, context = {}) {
  const courses =
    (context.courses || [])
      .slice(0, 3)
      .join(', ') || 'your courses';

  const nextClass =
    context.nextClass || 'your next class';

  return `Study "${prompt}" for 25 minutes from ${courses}. Review your notes before ${nextClass}, then practice 5 questions.`;
}

module.exports = {
  getStudyHelp,
  buildFallbackPlan,
};