import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function CollapsibleIngredients({ ingredients }: { ingredients: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-lg font-bold hover:underline focus:outline-none"
      >
        {isOpen ? <ChevronDown /> : <ChevronRight />}
        Extracted Ingredients
      </button>
      {isOpen && (
        <ul className="list-disc pl-6 text-gray-700 mt-2">
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
