import { useNavigate } from "react-router-dom";
import "./Home.scss";
import { signInWithGoogle } from "../../utils/signInWithGoogle";
import { HomeProps } from "../../interface";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SignInWithGoogleButton } from "../../components/SignInWithGoogleButton/SignInWithGoogleButton";
import pairProgramming from "../../assets/images/undraw_pair_programming.svg";

export function Home(props: HomeProps) {
  const setUsername = props.setUsername;
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName) {
        setUsername(user.displayName);
        navigate("/code");
      }
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  async function signIn() {
    try {
      const username = await signInWithGoogle();
      setUsername(username);
      navigate("/code");
    } catch {
      console.log("unable to sign in");
    }
  }

  return (
    <main className="landing-page">
      <nav className="navbar">
        <h1 className="navbar__heading">DevRoulette</h1>
      </nav>
      <div className="hero">
        <div className="hero__left">
          <div className="hero_text">
            <h2 className="hero__subheading">
              Find your coding partner in seconds
            </h2>
            <p className="hero__copy">
              Jump into a live coding session with another developer – no setup
              needed.
            </p>
            <SignInWithGoogleButton
              onClickFunction={signIn}
            ></SignInWithGoogleButton>
          </div>
        </div>
        <div className="hero__right">
          <img
            className="hero__image"
            src={pairProgramming}
            alt="roulette wheel in pixel art style"
          ></img>
        </div>
      </div>
    </main>
  );
}
