import { useState, useEffect } from "react";
import { url } from "@/Libs/urls.js";

export default function Plane2({ crash = false }) {
    const [planePositionX, setPlanePositionX] = useState(0);
    const [planePositionY, setPlanePositionY] = useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlanePositionX((prevPosition) => prevPosition + 1);
            setPlanePositionY((prevPosition) => prevPosition - 1);
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const tailLength = Math.min(planePositionX * 2, 80); // Limit tail length

    return (
        <div className="relative h-[180px] md:h-[290px] lg:h-[400px] overflow-hidden  border w-full">
            <div
                className={`absolute bottom-0 left-0 h-[2px] md:h-1 transition-all duration-100 ease-in-out  
                    ${
                        crash
                            ? " rotate-[10deg]"
                            : "-rotate-[18deg] bg-[#C3865A] "
                    }`}
                style={{
                    width: `${tailLength}%`,
                    left: "-25px",
                    bottom: `${tailLength / 2.8}%`,
                }}
            >
                <div
                    className={`ml-auto -mr-[10px] md:-mr-[130px] -mt-2 md:-mt-5  h-[20px] w-[50px]  md:h-[50px] md:w-[150px]
                    transition-all duration-100 ease-in-out 
                    ${
                        crash
                            ? "rotate-0 -mr-[101px] md:-mr-[250px]"
                            : "rotate-[20deg]"
                    }
                    `}
                    style={{
                        backgroundImage: `url(${url("/assets/img/plane.png")})`,
                        backgroundSize: "cover",
                    }}
                ></div>
            </div>
        </div>
    );
}
