import { Link, useNavigate } from "react-router-dom";
import "./Home.scss";
import { signInWithGoogle } from "../../functions/signInWithGoogle";
import { HomeProps } from "../../interface";

export function Home(props: HomeProps) {

    const setUsername = props.setUsername
    const navigate = useNavigate()

    async function signIn(){
        try{
            const username = await signInWithGoogle()
            setUsername(username)
            navigate("/code")

        }catch{
            console.log("unable to sign in")
        }
    }
    
  return (
    <main className="hero">
      <h1 className="hero__heading">DevRoulette</h1>
      <h2 className="hero__subheading">Ephemeral Pair Programming Sessions</h2>
      <button className="hero__button" onClick={signIn}>
        sign in with google
      </button>
    </main>
  );
}
