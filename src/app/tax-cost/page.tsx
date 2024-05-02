const GeoJsonTaxCost = () => {
  return (
    <dialog className="card absolute left-0 top-0 py-8 px-4 m-0 w-1/4">
      <h2 className="card-title">Import Trail</h2>
      <div className="divider" />
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full"
      />
    </dialog>
  );
};

export default GeoJsonTaxCost;
