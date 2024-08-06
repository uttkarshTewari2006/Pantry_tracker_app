"use client";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import { ItemsBar } from "./components/itemsBar";
import { Cart } from "./components/Cart";
import { Recipie } from "./components/Recipies";

function capitalize(str) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function Home() {
  const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  const [items, setItems] = useState([
    { name: "milk", price: 4.95, quantity: 1 },
    { name: "Movie", price: 24.95, quantity: 1 },
    { name: "coffee", price: 4.95, quantity: 1 },
  ]);

  const [total, setTotal] = useState(34.85);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });
  const [search, setSearch] = useState("");

  const [sortKey, setSortKey] = useState("Alphabetical");
  const [buttonTracker, setButtonTracker] = useState(1);

  useEffect(() => {
    document.title = "Pantry app";
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      let totalCurrent = 0;
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
        totalCurrent += Number(doc.data().quantity) * Number(doc.data().price);
      });
      setItems(itemsArr);
      setTotal(totalCurrent);
    });
    return () => unsubscribe();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    const existingItemIndex = items.findIndex(
      (item) => capitalize(item.name.trim()) === capitalize(newItem.name.trim())
    );

    if (
      newItem.name !== "" &&
      newItem.price !== "" &&
      newItem.quantity !== "" &&
      existingItemIndex === -1
    ) {
      const newItemData = {
        name: newItem.name.trim(),
        price: Number(newItem.price),
        quantity: Number(newItem.quantity),
      };
      setItems((prevItems) => [...prevItems, newItemData]);
      setTotal(
        (prevTotal) => prevTotal + newItemData.price * newItemData.quantity
      );

      await addDoc(collection(db, "items"), newItemData);
      setNewItem({ name: "", price: "", quantity: "" });
    } else if (existingItemIndex !== -1) {
      const updatedItems = items.map((item, idx) => {
        if (idx === existingItemIndex) {
          const updatedItem = {
            ...item,
            quantity: Number(item.quantity) + Number(newItem.quantity),
          };
          setTotal(
            (prevTotal) => prevTotal + item.price * Number(newItem.quantity)
          );
          return updatedItem;
        }
        return item;
      });
      setItems(updatedItems);
      setNewItem({ name: "", price: "", quantity: "" });
    }
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const getButtonClass = (id) => {
    return `rounded border-2 border-black w-32 h-7 ${
      buttonTracker === id
        ? "bg-indigo-800 text-white"
        : "bg-white text-black hover:bg-black hover:text-white"
    }`;
  };

  return (
    <main className="bg-black-500 flex min-h-screen flex-col items-center justify-between p-4 sm:p-24 w-full">
      <div className="z-10 max-w-3xl w-full items-center justify-between font-mono text-sm">
        <div className="mt-12 flex justify-between">
          <span></span>
          <div>
            <button
              id="button1"
              className={getButtonClass(1)}
              onClick={() => {
                setButtonTracker(1);
              }}
            >
              Add items
            </button>
            <button
              id="button2"
              className={getButtonClass(2)}
              onClick={() => {
                setButtonTracker(2);
              }}
            >
              View cart
            </button>
            <button
              id="button2"
              className={getButtonClass(3)}
              onClick={() => {
                setButtonTracker(3);
              }}
            >
              Generate recipie
            </button>
          </div>
          <span></span>
        </div>
        {buttonTracker === 1 && (
          <ItemsBar
            items={items}
            setItems={setItems}
            newItem={newItem}
            setNewItem={setNewItem}
            addItem={addItem}
            search={search}
            setSearch={setSearch}
            setTotal={setTotal}
            deleteItem={deleteItem}
            total={total}
          />
        )}
        {buttonTracker === 2 && (
          <Cart
            items={items}
            setItems={setItems}
            newItem={newItem}
            setNewItem={setNewItem}
            addItem={addItem}
            search={search}
            setSearch={setSearch}
            setTotal={setTotal}
            deleteItem={deleteItem}
            total={total}
            sortKey={sortKey}
            setSortKey={setSortKey}
          />
        )}
        {buttonTracker === 3 && (
          <Recipie
            items={items}
            SetItems={setItems}
            groqApiKey={groqApiKey}
          ></Recipie>
        )}
      </div>
    </main>
  );
}
