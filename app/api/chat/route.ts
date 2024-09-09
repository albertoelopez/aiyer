import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const embHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.AIYER_KEY}`,
};

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userMessage = body.message || 'Explain the importance of fast language models';

    const chatCompletion = await getGroqChatCompletion(userMessage);
    const text = chatCompletion.choices[0]?.message?.content || '';
    const listArray = text.match(/\d+\.\s[^]*(?=\d+\.\s|$)/g);

    let results = [];

    if (listArray) {
      results = await processListItems(listArray);
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get chat completion', details: (error as Error).message },
      { status: 500 }
    );
  }
}

async function getGroqChatCompletion(userMessage: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Always respond only with numbered lists. Provide no additional explanations or content. Summarize the key legal principles and case precedents that directly address the issue at hand, focusing on the most authoritative and relevant holdings.',
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
    model: 'llama3-8b-8192',
  });
}

async function processListItems(listArray: string[]) {
  const embeddingRequests = listArray.map(async (item) => {
    //await delay(1000);
    const embedding = await fetchEmbedding(item);
    if (embedding) {
      return await storeEmbeddingInSupabase(embedding);
    }
  });

  return Promise.all(embeddingRequests);
}

async function fetchEmbedding(input: string) {
  try {
    const response = await fetch('https://api.upstage.ai/v1/solar/embeddings', {
      method: 'POST',
      headers: embHeaders,
      body: JSON.stringify({
        model: 'solar-embedding-1-large-query',
        input,
      }),
    });

    if (response.ok) {
      const json = await response.json();
      return json.data[0].embedding;
    } else {
      console.error(`Failed to fetch embedding. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching embedding:', error);
  }
}

async function storeEmbeddingInSupabase(embedding: any) {
  try {
    const { data, error } = await supabase.rpc('cmon', {
      input_vector: embedding,
    });
    if (error) {
      console.error('Error storing embedding in Supabase:', error);
      return null;
    } else {
      return data;
    }
  } catch (error) {
    console.error('Error in Supabase request:', error);
    return null;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
