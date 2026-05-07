function Stats({ data }) {
  const applied = data.Applied.length;
  const interviewing = data.Interviewing.length;
  const offer = data.Offer.length;

  const total = applied + interviewing + offer;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-purple-100 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Applied</p>
        <h3 className="text-xl font-bold text-purple-600">{applied}</h3>
      </div>

      <div className="bg-green-100 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Interviewing</p>
        <h3 className="text-xl font-bold text-green-600">{interviewing}</h3>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Offers</p>
        <h3 className="text-xl font-bold text-yellow-600">{offer}</h3>
      </div>

      <div className="col-span-3 bg-gray-100 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Total Applications</p>
        <h3 className="text-2xl font-bold text-gray-800">{total}</h3>
      </div>
    </div>
  );
}

export default Stats;