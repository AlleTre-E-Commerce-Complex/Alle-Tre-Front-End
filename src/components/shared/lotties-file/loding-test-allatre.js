import Lottie from "react-lottie";
import lodingTestAllatre from "./loding-test-allatre.json";
import logo from "../../../..//src/assets/icons/logo-allatre-loding.png";

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
    <div className="mt-6">
      <img className="animate-pulse" src={logo} alt="logo" />
      {/* <Lottie options={defaultOptions} width={300} /> */}
    </div>
  );
};

export default LodingTestAllatre;
