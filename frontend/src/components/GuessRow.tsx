import { useEffect, useState } from "react";
import { Player } from "../types";
import { 
    calculate_age, 
    countryNameToFlag, 
    getPlayerImage, 
    getPlayerTop20, 
    getRolesColor, 
    getTeamColor, 
    getTeamImage, 
    getTop20Arrows 
} from "../utils";

interface TargetPlayer {
    country: string;
    roles: string;
    rating: number;
    team: string;
    team_history: string[];
    top20: number;
    majors: number;
    age: number;
}

interface GuessRowProps {
    guess: Player;
    target: TargetPlayer;
    darkMode: boolean;
}

export const GuessRow = ({ guess, target, darkMode }: GuessRowProps) => {
    const [visibleIndex, setVisibleIndex] = useState(-1);

    useEffect(() => {
        if (visibleIndex < 8) {
            const timer = setTimeout(() => {
                setVisibleIndex((prev) => prev + 1);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [visibleIndex]);

    const getAnimClass = (index: number) => {
        const isVisible = visibleIndex >= index;
        return `transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`;
    };

    const guessAge = calculate_age(guess.birth_date);

    return (
        <div className={`flex gap-2 mt-6 w-full max-w-7xl mx-auto items-center text-3xl h-40 transition-colors duration-300 min-w-max ${darkMode ? 'text-gray-900' : 'text-gray-900'}`}>
            <div className={`${getAnimClass(0)} w-72 shrink-0`}>
                 <img className="h-40 w-72 object-fill" src={getPlayerImage(guess.id)}/>
            </div>
            
            <div className={`${getAnimClass(1)} w-24 h-full shrink-0`}>
                <div className={`w-full h-full flex items-center justify-center shrink-0 ${guess.country === target.country ? "bg-green-300" : "bg-red-300"}`}>
                    {countryNameToFlag(guess.country)}
                </div>
            </div>

            <div className={`${getAnimClass(2)} w-48 h-full shrink-0`}>
                <div className={`w-full h-full flex items-center justify-center shrink-0 truncate ${getRolesColor(guess.roles, target.roles)}`}>
                    {guess.roles.toLowerCase()}
                </div>
            </div>

            <div className={`${getAnimClass(3)} w-28 h-full shrink-0`}>
                <div className={`w-full h-full flex flex-col items-center justify-center shrink-0 ${guess.rating === target.rating ? "bg-green-300" : "bg-red-300"}`}>
                    <span>{guess.rating}</span>
                    {guess.rating !== target.rating && <span>{guess.rating < target.rating ? "↑" : "↓"}</span>}
                </div>
            </div>

            <div className={`${getAnimClass(4)} w-48 h-full shrink-0`}>
                <div className={`w-full h-full flex items-center justify-center shrink-0 ${getTeamColor(target.team_history, target.team, guess.team)}`}>
                    <img className="max-h-32 max-w-[80%] object-contain" src={getTeamImage(guess.id)} alt={guess.team} />
                </div>
            </div>

            <div className={`${getAnimClass(5)} w-28 h-full shrink-0`}>
                 <div className={`w-full h-full flex flex-col items-center justify-center shrink-0 ${guess.top20 === target.top20 ? "bg-green-300" : "bg-red-300"}`}>
                    <span>{getPlayerTop20(guess.top20)}</span>
                    <span>{getTop20Arrows(guess.top20, target.top20)}</span>
                </div>
            </div>

            <div className={`${getAnimClass(6)} w-28 h-full shrink-0`}>
                <div className={`w-full h-full flex flex-col items-center justify-center shrink-0 ${guess.majors === target.majors ? "bg-green-300" : "bg-red-300"}`}>
                    <span>{guess.majors}</span>
                    {guess.majors !== target.majors && <span>{guess.majors < target.majors ? "↑" : "↓"}</span>}
                </div>
            </div>

            <div className={`${getAnimClass(7)} w-28 h-full shrink-0`}>
                <div className={`w-full h-full flex flex-col items-center justify-center shrink-0 ${guessAge === target.age ? "bg-green-300" : "bg-red-300"}`}>
                    <span>{guessAge}</span>
                    {guessAge !== target.age && <span>{guessAge < target.age ? "↑" : "↓"}</span>}
                </div>
            </div>
        </div>
    );
};
