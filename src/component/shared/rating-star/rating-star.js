import React from "react";
import { Rating } from "semantic-ui-react";

const RatingStare = ({ max, size }) => (
  <Rating size={size} icon="star" rating={max} maxRating={5} disabled />
);

export default RatingStare;
