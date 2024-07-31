"use client";
import { useState } from "react";
import { useEffect } from "react";
import {
  addDoc,
  collection,
  getDoc,
  QuerySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

function capitalize(str) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function Home() {
  let zero = 0;

  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr = [];
      let totalCurrent = 0;
      QuerySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
        totalCurrent += Number(doc.data().quantity) * Number(doc.data().price);
      });
      setItems(itemsArr);
      setTotal(totalCurrent);
      return () => unsubscribe;
    });
  }, []);

  const [items, setItems] = useState([
    { name: "milk", price: 4.95, quantity: 1 },
    { name: "Movie", price: 24.95, quantity: 1 },
    { name: "coffee", price: 4.95, quantity: 1 },
  ]);
  let isInArray;
  let quant;
  //add item to database
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
      setItems([...items, newItemData]);
      setTotal(total + newItemData.price * newItemData.quantity);

      await addDoc(collection(db, "items"), newItemData);
      setNewItem({ name: "", price: "", quantity: "" });
    } else if (existingItemIndex !== -1) {
      const updatedItems = items.map((item, idx) => {
        if (idx === existingItemIndex) {
          const updatedItem = {
            ...item,
            quantity: Number(item.quantity) + Number(newItem.quantity),
          };
          setTotal(total + item.price * Number(newItem.quantity));
          return updatedItem;
        }
        return item;
      });
      setItems(updatedItems);
      setNewItem({ name: "", price: "", quantity: "" });
    }
  };

  //read items from database

  //delete item from database
  const [total, setTotal] = useState(34.85);
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });

  const [search, setSearch] = useState("");

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };
  return (
    <main className="bg-black-500 flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 w-full">
      <div className="z-10 max-w-3xl w-full items-center justify-between font-mono text-sm">
        <h1 className="block text-4xl p-4 text-center w-100">Pantry Tracker</h1>
        <div className="p-2 bg-indigo-800 big-slate-800  sm:pl-4 pl-24 sm:pr-4 pr-24 rounded-lg w-full ">
          <form className="p-2 w-full flex flex-col items-center ">
            <div className="w-full flex flex-row justify-center">
              <input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                type="text"
                placeholder="enter item"
                className="bg-black borde text-white sm:mr-2 mr-6 p-3 sm:p-1  rounded-lg"
              ></input>
              <input
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                type="number"
                placeholder="enter $"
                className="bg-black text-white sm:mr-2 pr-6 sm:ml-2 ml-6 p-3 sm:p-1 sm:w-24 text-black rounded-lg"
              ></input>
              <input
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                type="number"
                placeholder="enter amount"
                className="bg-black text-white sm:mr-2 pr-6 sm:ml-2 ml-6 p-3 sm:p-1 sm:w-32 text-black rounded-lg"
              ></input>
              <button
                onClick={addItem}
                type="submit"
                className="bg-black text-white sm:mr-2 pr-6 sm:ml-2 ml-6 p-3 sm:p-1 rounded-lg sm:pl-2 pl-5 sm:pr-2 pr-5 hover:opacity-80"
              >
                add
              </button>
            </div>
            <input
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              type="text"
              placeholder="search"
              className="m-2 bg-black text-white sm:mr-2 pr-6 sm:ml-2 ml-6 p-3 sm:p-1 sm:w-32 text-black rounded-lg"
            ></input>
          </form>

          <ul>
            <li>
              <div className="text-black flex justify-between mt-2">
                <strong className="text-lg w-10">Name</strong>
                <strong className="text-lg w-10 pl-4">Quantity</strong>
                <strong className="text-right text-lg pr-5">Price</strong>
              </div>
            </li>
            {items
              .filter((Item) => {
                return Item.name.indexOf(search) != -1;
              })
              .map((item, index) => (
                <li>
                  <div key={item.name} className="flex justify-between mt-2">
                    <div className="w-16 lg:w-24 sm:w-28">
                      <button
                        className=" bg-white text-red-500 pl-1 pr-1 ml-1 mr-1 hover:opacity-80 rounded-lg"
                        onClick={() => {
                          setTotal(total + Number(item.price));
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
                        className=" bg-white text-red-500 pl-1 pr-1 mr-1 hover:opacity-80 rounded-lg"
                        onClick={() => {
                          setTotal(total - Number(item.price));
                          if (item.quantity === 1) {
                            setItems(
                              items.filter((entry) => entry.name !== item.name)
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
                      <span className="capitalize text-black text-lg ">
                        {item.name}
                      </span>
                    </div>

                    <span className="capitalize text-black text-lg text-center">
                      {item.quantity}
                    </span>
                    <div className="w-16">
                      <span className="text-right text-black pr-2">
                        {Number(item.price).toFixed(2)}
                      </span>
                      <button
                        className=" bg-white text-red-500 pl-1 pr-1 hover:opacity-80 rounded-lg"
                        onClick={() => {
                          setTotal(
                            total - Number(item.price) * Number(item.quantity)
                          );
                          deleteItem(item.id);
                          setItems(
                            items.filter((entry) => entry.name !== item.name)
                          );
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          {items.length == 0 || (
            <div className="flex flex-row justify-between">
              <strong className="pt-2 text-2xl">total</strong>
              <span className="text-lg pt-2">${total.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
