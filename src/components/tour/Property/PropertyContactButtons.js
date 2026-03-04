import { FaPhone, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function PropertyContactButtons({ pid, contactNumber }) {
  // Override phone number for pid 293 and 298
  const finalPhone =
    pid === 819 || pid === 293 || pid === 298 ? "8801841333322" : contactNumber?.Phone;

  return (
    <>
      {/* Mobile View – Phone */}
      <div className="md:hidden block mt-[10px]">
        <a href={`tel:${finalPhone}`} className="mr-[-1px] ml-0">
          <div className="phone-call md:w-[50px] md:h-[50px] w-[37px] h-[37px] ml-[15px]">
            <FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[10px] ml-[10px]" />
          </div>
        </a>
      </div>

      {/* Mobile View – WhatsApp */}
      <div className="md:hidden block mt-[10px]">
        <Link
          href={`https://wa.me/${finalPhone}`}
          className="mx-[10px]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px] ml-[15px]">
            <FaWhatsapp className="w-[25px] h-[25px] text-white" />
          </span>
        </Link>
      </div>

      {/* Desktop View */}
      <div className="md:block hidden">
        <div className="flex justify-start md:justify-start">
          <div className="flex items-center">
            <span className="text-black md:text-[16px] text-[14px] font-bold">
              For instant service:{" "}
            </span>

            {/* Desktop Phone */}
            <div className="mr-[5px] mt-[10px]">
              <a
                href={`tel:${finalPhone}`}
                className="mx-[10px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="phone-call md:w-[50px] md:h-[50px] w-[36px] h-[36px] ml-[15px]">
                  <FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[8px] ml-[11px]" />
                </div>
              </a>
            </div>

            {/* Desktop WhatsApp */}
            <div>
              <Link
                href={`https://wa.me/${finalPhone}`}
                className="mx-[10px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px]">
                  <FaWhatsapp className="w-[25px] h-[25px] text-white" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
