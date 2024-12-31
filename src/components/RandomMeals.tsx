'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
}

const RandomMeals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRandomMeals = async () => {
      setLoading(true);
      try {
        const promises = Array.from({ length: 3 }, () =>
          axios.get<{ meals: Meal[] }>('https://www.themealdb.com/api/json/v1/1/random.php')
        );

        const responses = await Promise.all(promises);
        const fetchedMeals = responses.map((response) => response.data.meals[0]);
        setMeals(fetchedMeals);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMeals();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!meals || meals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-semibold text-red-500">No meals found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Random Meals</h2>
      <div className="w-full max-w-screen-lg px-4 space-y-8">
        {meals.map((meal, index) => (
          <div
            key={meal.idMeal}
            className={`flex flex-col md:flex-row ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            } items-center gap-6 bg-white shadow-lg rounded-lg p-6`}
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full md:w-1/3 h-72 object-contain rounded-lg"
            />
            <div className="flex flex-col justify-between w-full">
              <h3 className="text-xl font-semibold mb-4">{meal.strMeal}</h3>
              <p className="text-gray-600 text-justify">
                {meal.strInstructions.slice(0, 300)}...
              </p>
              <Link
                href={`/meal/${meal.idMeal}`}
                className="mt-4 text-blue-500 hover:text-blue-700 font-medium text-sm self-start"
              >
                Learn More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RandomMeals;