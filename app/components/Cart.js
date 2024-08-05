import React, { useEffect } from "react";

const Cart = ({
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
  sortKey,
  setSortKey,
}) => {
  useEffect(() => {
    const sortedItems = [...items].sort((a, b) => {
      if (sortKey === "Alphabetical") {
        return a.name.localeCompare(b.name); // Corrected to sort in ascending order alphabetically
      } else if (sortKey === "PriceCheapest") {
        return a.price - b.price; // Simplified for numerical comparison
      } else if (sortKey === "PriceExpensive") {
        return b.price - a.price; // Corrected to sort in descending order by price
      } else if (sortKey === "QuantityMost") {
        return b.quantity - a.quantity; // Simplified for numerical comparison
      } else if (sortKey === "QuantityLeast") {
        return a.quantity - b.quantity; // Simplified for numerical comparison
      }
      return 0;
    });
    setItems(sortedItems);
  }, [sortKey, items, setItems]);

  return (
    <div className="p-4 bg-indigo-800 rounded-lg w-full">
      <form
        className="p-2 w-full flex flex-col items-center"
        onSubmit={addItem}
      >
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="search"
          className="m-2 bg-black text-white p-2 rounded-lg w-full sm:w-1/2"
        />
        <label className="flex flex-row justify-between items-center pl-2 m-2 bg-black text-white p-2 rounded-lg w-full sm:w-1/2">
          Sort by
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="m-2 bg-black text-white p-2 rounded-lg w-full sm:w-1/2"
            placeholder="Sort by"
          >
            <option value="Alphabetical">Alphabetical</option>
            <option value="PriceCheapest">Price (cheapest First)</option>
            <option value="PriceExpensive">Price (most expensive First)</option>
            <option value="QuantityMost">Quantity (most First)</option>
            <option value="QuantityLeast">Quantity (least First)</option>
          </select>
        </label>
      </form>

      <ul className="mt-4">
        <li key="Cart_title">
          <div className="text-white flex justify-between mt-2">
            <strong className="text-lg flex-1">Name</strong>
            <strong className="text-lg flex-1 text-center">Quantity</strong>
            <strong className="text-lg flex-1 text-right">Price</strong>
          </div>
        </li>
        {items
          .filter((item) => item.name.includes(search))
          .map((item, index) => (
            <li key={"Cart_" + item.id}>
              <div className="flex justify-between mt-2">
                <div className="flex items-center flex-1">
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

export { Cart };
