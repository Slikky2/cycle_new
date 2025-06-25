exports.handler = async function(event, context) {
  const { status } = JSON.parse(event.body);

  const prompt = `You're a funny assistant. Someone is asking if they are fertile today. Respond with a funny one-liner. Be clear if the user is SAFE or NOT SAFE. Status: ${status}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a witty assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: data.choices[0].message.content })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong.' })
    };
  }
};
