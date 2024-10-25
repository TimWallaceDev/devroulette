import { Link } from "react-router-dom";
import "./Home.scss"


export function Home(){

    return(
        <main className="hero">

            <h1 className="hero__heading">DevRoulette</h1>
            <h2 className="hero__subheading">Ephemeral Pair Programming Sessions</h2>
            <Link to="/code">
                <button className="hero__button">Code Now</button>
            </Link>
        </main>
    )
}