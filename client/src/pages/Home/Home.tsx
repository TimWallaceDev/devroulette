import { Link } from "react-router-dom";


export function Home(){

    return(
        <main>

            <h1>DevRoulette</h1>
            <h2>Ephemeral Coding Sessions</h2>
            <Link to="/code">
                <button>Join a Room</button>
            </Link>
        </main>
    )
}