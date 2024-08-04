import { useState } from "react";
import axios from "axios";

const apiToken = process.env.NEXT_PUBLIC_LLAMA_API_TOKEN;

const Recipie = ({ items }) => {
  const [recipieList, SetRecipieList] = useState([]);
  const [generatedRecipe, setGeneratedRecipe] = useState("");

  const handleCheckboxChange = (item) => {
    SetRecipieList((prevList) => {
      const newList = [...prevList];
      if (newList.some((existingItem) => existingItem.id === item.id)) {
        return newList.filter((existingItem) => existingItem.id !== item.id);
      } else {
        return [...newList, item];
      }
    });
  };

  const handleGenerate = async () => {
    let generateString = "Generate a recipe with the following ingredients: ";
    recipieList.forEach((item) => {
      generateString += `${item.quantity} ${item.name}, `;
    });

    try {
      const response = await axios.post(
        "/api/proxy",
        {
          messages: [{ role: "user", content: generateString }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setGeneratedRecipe(data.choices[0].message.content);
      console.log(data.choices[0].message.content); // Assuming response.data contains the recipe string
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
