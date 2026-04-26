import React from 'react';
import { Roboto } from 'next/font/google';
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] });
const PaymentMethods = ({ property_name }) => {
  const paymentOptions = [
    {
      title: "bKash",
      serviceCharge: "2% bkash service charge will be added.",
      process: [
        { label: "Dial", value: "*247#, Choose “Payment“" },
        { label: "Merchant number", value: "01605-779999" },
        { label: "Amount", value: "xxx" },
        { label: "Enter Ref", value: "111" }
      ]
    },
    {
      title: "Nagad",
      serviceCharge: "2% Nagad service charge will be added.",
      process: [
        { label: "Dial", value: "*167#, Select “Payment“" },
        { label: "Merchant number", value: "01748704622" },
        { label: "Amount", value: "xxx" },
        { label: "Enter Ref", value: "111" }
      ]
    },
    {
      title: "Bank",
      serviceCharge: null,
      process: [
        { label: "Bank", value: "BRAC Bank Limited" },
        { label: "Account ID", value: "2067559440001" },
        { label: "Account Name", value: "BOOKME" },
        { label: "Branch", value: "CDA Avenue, Chittagong" },
        { label: "Branch Routing No", value: "060151481" }
      ]
    },
    {
      title: "Cash",
      serviceCharge: null,
      process: [
        { label: "Address", value: "IFCO Complex (2nd floor), GEC Circle, CDA Avenue, Chattogram" },
        { label: "Phone", value: "01841999922" }
      ]
    }
  ];

  return (
    <section className=" max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-blue-950 mb-2">
          Payment Method For <span className="text-red-600">{property_name}</span>
        </h2>
        <p className="text-gray-600 mb-10">
          Choose your desired payment method to book {property_name} ticket for your journey with {property_name}.
        </p>

        <div className={`grid ${roboto.className} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}>
          {paymentOptions.map((option, idx) => (
            <div style={{
              boxShadow: `
    inset 0 4px 8px rgba(67, 56, 202, 0.1),   /* top */
    inset 0 -4px 8px rgba(67, 56, 202, 0.1),  /* bottom */
    inset 4px 0 8px rgba(67, 56, 202, 0.1),   /* left */
    inset -4px 0 8px rgba(67, 56, 202, 0.1)   /* right */
  `
            }}
              key={idx} className="bg-gray-50 rounded-lg shadow-md p-6 text-left hover:shadow-lg transition duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{option.title}</h3>
              {option.serviceCharge && (
                <p className="text-sm text-gray-600 mb-4">For {option.title} payment {option.serviceCharge}</p>
              )}
              <div className="text-sm text-gray-700 space-y-1">
                {option.process.map((item, i) => (
                  <p key={i}><span className="font-semibold">{item.label}:</span> {item.value}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
