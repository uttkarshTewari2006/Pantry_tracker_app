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

function capitalize(str) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function Home() {
  useEffect(() => {
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

  const [items, setItems] = useState([
    { name: "milk", price: 4.95, quantity: 1 },
    { name: "Movie", price: 24.95, quantity: 1 },
    { name: "coffee", price: 4.95, quantity: 1 },
  ]);

  const [total, setTotal] = useState(34.85);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });
  const [search, setSearch] = useState("");

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

  return (
    <main className="bg-black-500 flex min-h-screen flex-col items-center justify-between p-4 sm:p-24 w-full">
      <div className="z-10 max-w-3xl w-full items-center justify-between font-mono text-sm">
        <h1 className="block text-4xl p-4 text-center w-full">
          Pantry Tracker
        </h1>
        <div className="p-4 bg-indigo-800 rounded-lg w-full">
          <form
            className="p-2 w-full flex flex-col sm:flex-row items-center"
            onSubmit={addItem}
          >
            <div className="w-full flex sm:flex-col xs:flex-col flex-row flex-nowrap justify-center">
              <input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                type="text"
                placeholder="enter item"
                className="bg-black border text-white m-1 p-2 rounded-lg flex-1 "
              />
              <input
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                type="number"
                placeholder="$"
                className="bg-black text-white m-1 p-2 rounded-lg flex-1 w-2/5 sm:w-full"
              />
              <input
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                type="number"
                placeholder="amount"
                className="bg-black text-white m-1 p-2 rounded-lg flex-1 w-2/5 sm:w-full"
              />
              <button
                type="submit"
                className="bg-black text-white m-1 p-2 rounded-lg flex-1 w-1/5 hover:opacity-80 sm:w-full"
              >
                add
              </button>
            </div>
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="search"
              className="m-2 bg-black text-white p-2 rounded-lg w-full sm:w-1/2"
            />
          </form>

          <ul className="mt-4">
            <li>
              <div className="text-white flex justify-between mt-2">
                <strong className="text-lg flex-1">Name</strong>
                <strong className="text-lg flex-1 text-center">Quantity</strong>
                <strong className="text-lg flex-1 text-right">Price</strong>
              </div>
            </li>
            {items
              .filter((item) => item.name.includes(search))
              .map((item, index) => (
                <li key={item.id}>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center flex-1">
                      <button
                        className="bg-white text-red-500 p-1 mx-1 hover:opacity-80 rounded-lg"
                        onClick={() => {
                          setTotal(
                            (prevTotal) => prevTotal + Number(item.price)
                          );
                          const newItems = items.map((itm, indx) => {
                            if (indx === index) {
                              return {
                                ...itm,
                                quantity: Number(itm.quantity) + 1,
                              };
                            }
                            return itm;
                          });
                          setItems(newItems);
                        }}
                      >
                        +
                      </button>
                      <button
                        className="bg-white text-red-500 p-1 mx-1 hover:opacity-80 rounded-lg"
                        onClick={() => {
                          setTotal(
                            (prevTotal) => prevTotal - Number(item.price)
                          );
                          if (item.quantity === 1) {
                            setItems((prevItems) =>
                              prevItems.filter(
                                (entry) => entry.name !== item.name
                              )
                            );
                          } else {
                            const newItems = items.map((itm, indx) => {
                              if (indx === index) {
                                return {
                                  ...itm,
                                  quantity: Number(itm.quantity) - 1,
                                };
                              }
                              return itm;
                            });
                            setItems(newItems);
                          }
                        }}
                      >
                        -
                      </button>
                      <span className="capitalize text-white text-lg">
                        {item.name}
                      </span>
                    </div>

                    <span className="capitalize text-white text-lg text-center flex-1">
                      {item.quantity}
                    </span>
                    <div className="flex-1 text-right">
                      <span className="text-white pr-2">
                        {Number(item.price).toFixed(2)}
                      </span>
                      <button
                        className="bg-white text-red-500 p-1 hover:opacity-80 rounded-lg"
                        onClick={() => {
                          setTotal(
                            (prevTotal) =>
                              prevTotal -
                              Number(item.price) * Number(item.quantity)
                          );
                          deleteItem(item.id);
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          {items.length > 0 && (
            <div className="flex justify-between mt-4">
              <strong className="text-2xl text-white">Total</strong>
              <span className="text-lg text-white">${total.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

