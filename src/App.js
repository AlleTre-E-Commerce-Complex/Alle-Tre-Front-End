import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { authentications } from "./firebase-config";

function App() {
  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(authentications, provider)
      .then((res) => {
        console.log({ facebook: res });
      })
      .catch((err) => {
        console.log({ facebook: err });
      });
  };
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentications, provider)
      .then((res) => {
        console.log({ google: res });
      })
      .catch((err) => {
        console.log({ google: err });
      });
  };

  const signInWithApple = () => {
    const provider = new OAuthProvider("apple.com");
    signInWithPopup(authentications, provider)
      .then((res) => {
        console.log({ apple: res });
      })
      .catch((err) => {
        console.log({ apple: err });
      });
  };

  return (
    <div className="App flex">
      <button
        className="bg-blue-500 text-white p-4"
        onClick={signInWithFacebook}
      >
        sign in with face book
      </button>
      <button className="bg-red-500 text-white p-4" onClick={signInWithGoogle}>
        sign in with google
      </button>
      <button className="bg-black text-white p-4" onClick={signInWithApple}>
        sign in with apple
      </button>
    </div>
  );
}

export default App;
