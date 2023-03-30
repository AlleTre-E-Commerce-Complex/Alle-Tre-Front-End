import React from "react";
import { BiCheck } from "react-icons/bi";
import useFilter from "../../../hooks/use-filter";

const removeFromArray = (arr, v) => arr.filter((a) => a !== v);

const MultiButtonFilter = ({ name, values, history }) => {
  const [filter, setFilter] = useFilter(name, []);

  return (
    <div className="pt-4">
      {values.map((v) => (
        <div className="flex pt-4 gap-x-3 ">
          <button
            className={`${
              filter.includes(v?.value)
                ? "bg-primary text-white border-primary "
                : "bg-white  border-[1px] border-[#E5E5E5] "
            }  w-[14px] h-[14px] rounded-sm flex justify-center items-center mt-1`}
            onClick={() =>
              setFilter(
                filter.includes(v?.value)
                  ? removeFromArray(filter, v?.value)
                  : [...filter, v?.value]
              )
            }
          >
            {filter.includes(v?.value) ? <BiCheck size={20} /> : ""}
          </button>
          <p
            onClick={() =>
              setFilter(
                filter.includes(v?.value)
                  ? removeFromArray(filter, v?.value)
                  : [...filter, v?.value]
              )
            }
            className="text-gray-dark text-base font-normal px-2 cursor-pointer "
          >
            {v?.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MultiButtonFilter;
