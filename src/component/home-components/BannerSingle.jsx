import React, { useState, useEffect } from 'react';
import BannerTopImage1 from '../../assets/images/BannerTop1.png';


const BannerSingle = ({banner}) => {
  
    return (
        <div className="relative w-full  mt-10 mx-auto">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-[29rem]">
                        <div>
                            <img
                                src={BannerTopImage1}
                                className="w-full h-full object-cover"
                                alt={`Live Auctions`}
                            />
                        </div>
            </div>

          
          
        </div>
    );
};

export default BannerSingle;
