import Lottie from "react-lottie";
import lodingTestAllatre from "./loading-test2-alletre.json";


const LodingTestAllatre = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lodingTestAllatre,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="mt-6 cursor-wait">
      <Lottie
        className="cursor-wait"
        isClickToPauseDisabled={true}
        options={defaultOptions}
        width={150}
      />
    </div>
  );
};

export default LodingTestAllatre;
