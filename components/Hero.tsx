"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'

interface Ingredient {
    name: string;
    quantity: string;
}

export default function Hero() {

    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [recipes, setRecipes] = useState<any>()

    function checkIngredients(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        
        const ingredient = formData.get("ingredient") as string;
        const quantity  = formData.get("quantity") as string;
        
        if(ingredient.trim() === "" || parseInt(quantity) <= 0) {
            setError("Ensure all fields are filled correctly.");
            return
        }else{
            setError(null);
        }
        const ingredientObject = {
            name:ingredient.trim(),
            quantity:quantity,
        };
        setIngredientsList((prevList) => [...prevList, ingredientObject])
        event.currentTarget.reset();
    }
    async function handleRecipes(){
        setLoading(true);   
        try {
            const response = await fetch("/api/recipe", {
                method:"POST",
                headers:{
                    "Conten-Type": "application/json",
                },
                body:JSON.stringify({ingredientsList})
            })
            const result = await response.json();
            setRecipes(result.suggestions)
        } catch (error) {
            console.error("Error fetching the recipes", error)
            setError('Error fetching recipes.')
        }finally{
            setLoading(false);
        }
    }
    console.log(recipes)

    return (
        <section className='max-w-7xl mx-auto mt-5 md:mt-20 px-3'>
            <div className='flex flex-col items-center gap-2 '>
                <h1 className='text-5xl md:text-7xl font-bold tracking-tighter max-w-[729px] text-center text-gray-950'>Welcome to Recipe Generator</h1>
                <p className='text-lg text-gray-400 text-center max-w-[729px] tracking-tight'>Start entering your ingredients and see what you can do with you have and do not worry about what to do about dinner.</p>
                <form 
                onSubmit={checkIngredients}
                className='flex flex-col gap-2 mt-2' 
                >
                    <div className='flex gap-2'>
                        <input type="number"
                        placeholder='e.g., 2'
                        name='quantity'
                        id='quantity' 
                        className='border border-black/10 rounded-md w-16 h-10'
                        />
                        <input
                        type='text'
                        name='ingredient'
                        id='ingredient'
                        required
                        placeholder='e.g., Onion'
                        className='border border-black/10 rounded-md w-48 h-10'
                        />
                    </div>
                    <Button type='submit'>Put in the pot</Button>
                </form>
                {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                <p className='font-bold text-lg tracking-tight'>Total Ingredients:</p>
                <ul>
                    {ingredientsList.map((ingredient, index) => (
                        <li key={index}><p className='text-center mt-1 tracking-tight'>{ingredient.name} x{ingredient.quantity}</p></li>
                    ))}
                </ul>
                {ingredientsList.length > 2 ? (
                    <>
                        <Button onClick={handleRecipes} disabled={loading}>
                            {loading ? "Loading..." : "See what you can do"}
                        </Button>
                        {recipes && (
                            <div className='mt-4'>
                                <h2 className='text-2xl font-bold'>Recipe Suggestions:</h2>
                                <ul>
                                    {recipes.map((recipe: string, index: number) => (
                                        <li key={index} className='mt-2'>{recipe}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <p>You need at least 3 ingredients to see suggestions.</p>
                )}
            </div>
        </section>
    )
}
