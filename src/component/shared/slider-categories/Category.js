// import React from "react";
// import { useHistory } from "react-router-dom";
// import routes from "../../../routes";
// import addImage from "../../../../src/assets/icons/add-image-icon.png";

// const Category = ({ img, title, id, view }) => {
//   const history = useHistory();
//   return (
//     <div className="md:px-24 px-16">
//       <div className="group ">
//         <div
//           onClick={
//             view
//               ? ""
//               : () =>
//                   history.push(
//                     `${routes.app.categories(title, id)}?categories[]=${id}`
//                   )
//           }
//           className=" w-[80px] h-[80px] md:w-[119px] md:h-[119px] bg-white hover:bg-primary/10 duration-300 ease-in-out transform rounded-full pt-2.5 cursor-pointer"
//         >
//           <div className="w-[60px] h-[60px] md:w-[98px] md:h-[98px]  rounded-full bg-secondary  group-hover:bg-primary duration-300 ease-in-out transform  mx-auto my-auto p-3 flex justify-center items-center">
//             <img
//               className={
//                 img
//                   ? "group-hover:scale-125  duration-300 ease-in-out transform flex justify-center items-center"
//                   : "  group-hover:scale-125  duration-300 ease-in-out transform flex justify-center items-center"
//               }
//               src={img || addImage}
//               alt={title}
//             />
//           </div>
//         </div>
//         <p className="text-gray-dark font-normal max-w-[90px] md:max-w-[119px]  text-base text-center group-hover:text-primary ">
//           {title}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Category;


import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../../routes";
import addImage from "../../../../src/assets/icons/add-image-icon.png";

const Category = ({ img, title, id, view }) => {
  const history = useHistory();
  console.log('title',title,id)
  // Condition to check if the category should be disabled
  const isDisabled = id === 1 || id === undefined;

  return (
    <div className="md:px-24 px-16 relative">
      <div className="group ">
        {/* Coming Soon Tag */}
        {!isDisabled && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Coming Soon
          </div>
        )}

        <div
          onClick={
            view || !isDisabled
              ? null
              : () =>
                  history.push(
                    `${routes.app.categories(title, id)}?categories[]=${id}`
                  )
          }
          className={`w-[80px] h-[80px] md:w-[119px] md:h-[119px] bg-white ${
            !isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10"
          } duration-300 ease-in-out transform rounded-full pt-2.5`}
        >
          <div
            className={`w-[60px] h-[60px] md:w-[98px] md:h-[98px] rounded-full ${
              !isDisabled ? "bg-gray-300" : "bg-secondary group-hover:bg-primary"
            } duration-300 ease-in-out transform mx-auto my-auto p-3 flex justify-center items-center`}
          >
          <img
  className={`${
    !isDisabled
      ? "opacity-50"
      : "group-hover:scale-125 duration-300 ease-in-out transform flex justify-center items-center"
  }`}
  src={img || addImage}
  alt={title}
/>

          </div>
        </div>
        <p
          className={`text-gray-dark font-normal max-w-[90px] md:max-w-[119px] text-base text-center ${
            !isDisabled ? "opacity-50" : "group-hover:text-primary"
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
};

export default Category;
