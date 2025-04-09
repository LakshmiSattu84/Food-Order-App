import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.js";

const requestConfig = {};

export default function Meals() {

const { data: loadedMeals, isLoading, error } = useHttp('http://localhost:3000/meals', requestConfig, []);
    
    if (isLoading) {
        return (<p className="center">Fetching Meals...</p>)
    }

    if (error) {
        return (<p className="error">Failed to fetch meals.</p>);
    }
    
    return (
        <ul id="meals">
            {loadedMeals.map(meal => {
                return (
                    <MealItem key={meal.id} meal={meal} />
                )
            })}
        </ul>
    );
}