import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

interface Ingredient {
    name: string;
    quantity: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { ingredientsList } : {ingredientsList:Ingredient[]} = await request.json();

    const formattedIngredients = ingredientsList.map(
      ingredient=> `${ingredient.quantity} ${ingredient.name}`
    ).join(', ');

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a chef." },
        { role: "user", content: `I have the following ingredients: ${formattedIngredients}. Give me 3 different recipes in the format: Recipe Name - Recipe Time - Recipe Ingredients - Difficulty` },
      ],
      max_tokens: 150, 
    });

    if (!response.choices[0]?.message?.content) {
      return NextResponse.json({ error: 'No suggestions generated.' }, { status: 500 });
    }

    const suggestions = response.choices[0].message.content.trim().split('\n');
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json({ error: 'Error generating suggestions' }, { status: 500 });
  }
}
