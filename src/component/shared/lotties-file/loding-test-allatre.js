// import Lottie from "react-lottie";
// import lodingTestAllatre from "./loading-test2-alletre.json";
import loadingTest from "../../../../src/assets/images/lodingIcon.gif";


const LodingTestAllatre = () => {
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: lodingTestAllatre,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  return (
    <div className="mt-6 cursor-wait">
      {/* <Lottie
        className="cursor-wait"
        isClickToPauseDisabled={true}
        options={defaultOptions}
        width={150}
      /> */}
      <img 
      src={loadingTest} 
      alt="loading" 
      className="cursor-wait"
      style={{ width: "550px", height: "auto" }}
      />
    </div>
  );
};

export default LodingTestAllatre;
