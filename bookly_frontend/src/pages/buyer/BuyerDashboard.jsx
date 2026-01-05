import BuyerBooks from "./BuyerBooks";

export default function BuyerDashboard() {
  return (
    <>
      <div className="text-center mb-6 mt-4">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Browse Books
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Discover books added by sellers
        </p>
      </div>
      <BuyerBooks />
    </>
  );
}
