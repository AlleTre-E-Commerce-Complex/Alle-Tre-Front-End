import React from "react";
import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import RatingStare from "../shared/rating-star/rating-star";

const Feedback = () => {
  return (
    <div className="animate-in">
      <div className="w-full bg-background drop-shadow rounded-lg pt-4">
        <div className="flex flex-wrap sm:flex-nowrap my-6 ">
          <div className="flex gap-x-2 ltr:pl-6 rtl:pr-6">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={userProfileicon}
              alt="userProfileicon"
            />
            <div className="mt-1 w-44">
              <p className="text-gray-dark text-sm font-normal">Haleem Rafat</p>
              <p className="text-gray-med text-xs font-normal">
                March 23 . 2023
              </p>
            </div>
          </div>

          <div className="mr-11 ml-11 sm:ml-0 mt-2 pb-4">
            <RatingStare max={3} size="small" />
            <p className="text-gray-med text-sm font-normal pt-2">
              Great phone. Very impressive features. You can have 2 audio
              sources less one person plugged into headphones and maybe another
              person connected with bluetooth headphones and both people can be
              listening to different music. S-Pen is super useful. I like being
              able to draw a box around some text.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-background drop-shadow rounded-lg pt-4">
        <div className="flex flex-wrap sm:flex-nowrap my-6 ">
          <div className="flex gap-x-2 ltr:pl-6 rtl:pr-6">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={userProfileicon}
              alt="userProfileicon"
            />
            <div className="mt-1 w-44">
              <p className="text-gray-dark text-sm font-normal">Haleem Rafat</p>
              <p className="text-gray-med text-xs font-normal">
                March 23 . 2023
              </p>
            </div>
          </div>

          <div className="mr-11 ml-11 sm:ml-0 mt-2 pb-4">
            <RatingStare max={3} size="small" />
            <p className="text-gray-med text-sm font-normal pt-2">
              Great phone. Very impressive features. You can have 2 audio
              sources less one person plugged into headphones and maybe another
              person connected with bluetooth headphones and both people can be
              listening to different music. S-Pen is super useful. I like being
              able to draw a box around some text.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-background drop-shadow rounded-lg pt-4">
        <div className="flex flex-wrap sm:flex-nowrap my-6 ">
          <div className="flex gap-x-2 ltr:pl-6 rtl:pr-6">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={userProfileicon}
              alt="userProfileicon"
            />
            <div className="mt-1 w-44">
              <p className="text-gray-dark text-sm font-normal">Haleem Rafat</p>
              <p className="text-gray-med text-xs font-normal">
                March 23 . 2023
              </p>
            </div>
          </div>

          <div className="mr-11 ml-11 sm:ml-0 mt-2 pb-4">
            <RatingStare max={3} size="small" />
            <p className="text-gray-med text-sm font-normal pt-2">
              Great phone. Very impressive features. You can have 2 audio
              sources less one person plugged into headphones and maybe another
              person connected with bluetooth headphones and both people can be
              listening to different music. S-Pen is super useful. I like being
              able to draw a box around some text.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-background drop-shadow rounded-lg pt-4">
        <div className="flex flex-wrap sm:flex-nowrap my-6 ">
          <div className="flex gap-x-2 ltr:pl-6 rtl:pr-6">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={userProfileicon}
              alt="userProfileicon"
            />
            <div className="mt-1 w-44">
              <p className="text-gray-dark text-sm font-normal">Haleem Rafat</p>
              <p className="text-gray-med text-xs font-normal">
                March 23 . 2023
              </p>
            </div>
          </div>

          <div className="mr-11 ml-11 sm:ml-0 mt-2 pb-4">
            <RatingStare max={3} size="small" />
            <p className="text-gray-med text-sm font-normal pt-2">
              Great phone. Very impressive features. You can have 2 audio
              sources less one person plugged into headphones and maybe another
              person connected with bluetooth headphones and both people can be
              listening to different music. S-Pen is super useful. I like being
              able to draw a box around some text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
