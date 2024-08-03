"use client";

import React from "react";

const ItemsBar = ({
  items,
  setItems,
  newItem,
  setNewItem,
  addItem,
  search,
  setSearch,
  setTotal,
  deleteItem,
  total,
}) => {
  return (
    <div className=" p-4 bg-indigo-800 rounded-lg w-full">
      <form
        className="p-2 w-full flex flex-col items-center"
        onSubmit={addItem}
      >
        <div className="w-full flex flex-row flex-wrap justify-center">
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            type="text"
            placeholder="enter item"
            className="bg-black border text-white m-1 p-2 rounded-lg flex-1 w-2/5 min-w-[120px] xs:w-full"
          />
          <input
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            type="number"
            placeholder="$"
            className="bg-black text-white m-1 p-2 rounded-lg xs:w-full w-1/5 min-w-[80px]"
          />
          <input
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: e.target.value })
            }
            type="number"
            placeholder="amount"
            className="bg-black text-white m-1 p-2 rounded-lg flex-1 xs:w-full w-2/5 min-w-[100px]"
          />
          <button
            type="submit"
            className="bg-black text-white m-1 p-2 rounded-lg flex-1 w-1/5 hover:opacity-80 xs:w-full"
            onClick={console.log("")}
          >
            add
          </button>
        </div>
      </form>

      <ul className="mt-4">
        <li id="itemsBar_title">
          <div className="text-white flex justify-between mt-2">
            <strong className="text-lg flex-1">Name</strong>
            <strong className="text-lg flex-1 text-center">Quantity</strong>
            <strong className="text-lg flex-1 text-right">Price</strong>
          </div>
        </li>
        {items
          .filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <li key={"itemsBar_" + item.name}>
              <div className="flex justify-between mt-2">
                <div className="flex items-center flex-1">
                  <button
                    className="bg-white text-red-500 p-1 mx-1 hover:opacity-80 rounded-lg"
                    onClick={() => {
                      setItems(
                        items.map((i) =>
                          i.id === item.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                        )
                      );
                      setTotal((prevTotal) => prevTotal + Number(item.price));
                    }}
                  >
                    +
                  </button>
                  <button
                    className="bg-white text-red-500 p-1 mx-1 hover:opacity-80 rounded-lg"
                    onClick={() => {
                      if (item.quantity > 1) {
                        setItems(
                          items.map((i) =>
                            i.id === item.id
                              ? { ...i, quantity: i.quantity - 1 }
                              : i
                          )
                        );
                      } else {
                        setItems(items.filter((i) => i.id !== item.id));
                      }
                      setTotal((prevTotal) => prevTotal - Number(item.price));
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
                    onClick={() => deleteItem(item.id)}
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
  );
};

export { ItemsBar };
