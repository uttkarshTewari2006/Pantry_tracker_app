import { useState } from "react";
import axios from "axios";
import Groq from "groq-sdk";

const Recipie = ({ items, groqApiKey }) => {
  const groq = new Groq({
    apiKey: groqApiKey,
    dangerouslyAllowBrowser: true,
  });
  const [recipieList, setRecipieList] = useState([]);
  const [generatedRecipe, setGeneratedRecipe] = useState("");

  const handleCheckboxChange = (item) => {
    setRecipieList((prevList) => {
      const newList = [...prevList];
      if (newList.some((existingItem) => existingItem.id === item.id)) {
        return newList.filter((existingItem) => existingItem.id !== item.id);
      } else {
        return [...newList, item];
      }
    });
  };
  async function getGroqChatCompletion(Content) {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: Content,
        },
      ],
      model: "llama3-8b-8192",
    });
  }
  const handleGenerate = async () => {
    let generateString =
      'Generate a recipe with the following ingredients, fromatting it in this syntax - "Dish name: *enter dish name here* \nIngredients: *enter Ingredients here* \nSteps: *enter Steps here". Also make it as concise as possible without compromising the quality of the recipe. Here are the list of the ingredients and their quantities : ';
    recipieList.forEach((item) => {
      generateString += `${item.quantity} ${item.name}, `;
    });

    try {
      const chatCompletion = await getGroqChatCompletion(generateString);
      // Print the completion returned by the LLM.
      setGeneratedRecipe(chatCompletion.choices[0]?.message?.content || "");
    } catch (error) {
      console.error(
        "Error generating recipe:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="p-4 bg-indigo-800 rounded-lg w-full">
      <div className="flex flex-col items-center justify-around">
        <h1>Choose which Items you want for your Recipes</h1>
        <ul className="w-full flex flex-col justify-between">
          <li key="title" className="flex flex-row justify-between">
            <span></span>
            <strong className="ml-14 capitalize text-white text-lg">
              Name
            </strong>
            <strong className="capitalize text-white text-lg">Amount</strong>
          </li>
          {items.map((item) => (
            <li key={item.id} className="flex flex-row justify-between">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(item)}
              />
              <span className="capitalize text-white text-lg">{item.name}</span>
              <span className="capitalize text-white text-lg text-center">
                {item.quantity}
              </span>
            </li>
          ))}
        </ul>
        <button
          className="m-2 bg-black text-white m-1 p-2 rounded-lg flex-1 w-1/5 hover:opacity-80 xs:w-full"
          onClick={handleGenerate}
        >
          Generate Recipe
        </button>
        <h1 id="recipie">{generatedRecipe}</h1>
      </div>
    </div>
  );
};

export { Recipie };
