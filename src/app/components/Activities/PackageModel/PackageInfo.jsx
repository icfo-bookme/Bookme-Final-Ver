const { default: Image } = require("next/image");

const PackageInfo = ({ selectedPackage }) => (
  <div className="flex items-start gap-4 pb-5 mb-5 border-b">
    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${selectedPackage.image}`}
        alt={selectedPackage.package_name}
        fill
        className="object-cover"
      />
    </div>
    <div>
      <h4 className="font-bold text-lg text-[#00026E]">{selectedPackage.package_name}</h4>
      <p className="text-sm text-gray-600 mb-1">{selectedPackage.duration}</p>
      <p className="font-semibold text-blue-900">
        {selectedPackage.discounted_price ?
          `${selectedPackage.discounted_price.toLocaleString()} TK` :
          `${selectedPackage.regular_price.toLocaleString()} TK`
        }
        <span className="text-xs font-normal text-gray-500 ml-2">per person</span>
      </p>
    </div>
  </div>
);
export default PackageInfo;