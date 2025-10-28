
export const VisaType = ({visaDetails}) => {
  return (
    <div className="">
  {/* Unit Cards */}
  {visaDetails?.property_uinit?.map((unit, index) => (
    <div key={unit?.id || index}>
      <div className="bg-white border rounded shadow-md p-4">
        <h1 className="font-medium text-lg mb-1">
          {unit?.unit_name}
          <span className="ml-2 text-gray-600">Type: {unit?.unit_type}</span>
        </h1>

        <div className="text-sm space-y-1 my-2">
          {/* Show Validity & Max Stay only if > 0 */}
          {(unit?.Validity > 0 || unit?.Max_Stay > 0) && (
            <div className="flex mb-4">
              {unit?.Validity > 0 && (
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Validity</div>
                  <div className="text-base font-bold">{unit?.Validity} Days</div>
                </div>
              )}

              {unit?.Max_Stay > 0 && (
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Max Stay</div>
                  <div className="text-base font-bold">{unit?.Max_Stay} Days</div>
                </div>
              )}
            </div>
          )}

          <p className="text-lg font-semibold">
            BDT {Math.ceil(unit?.price?.[0]?.price)}{" "}
            <span className="text-base font-light">/person</span>
          </p>
        </div>

        <p className="text-[#f59d3f] text-sm mt-2">
          ⚠️ Please contact our Visa department for Document processing.
        </p>
      </div>

      <button
        style={{
          background: "linear-gradient(90deg, #313881, #0678B4)",
        }}
        className="mt-[-5px] w-full font-semibold text-white text-sm py-2 rounded hover:bg-blue-700"
      >
        SELECT OFFER
      </button>
    </div>
  ))}
</div>

  )
}
