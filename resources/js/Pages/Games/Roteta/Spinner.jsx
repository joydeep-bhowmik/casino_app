import SpinnerItem from "./SpinnerItem";
import { ArrowUp, ArrowDown } from "./Arrows";

export default function Spinner({ products, spin = false }) {
    return (
        <>
            <div className="relative ">
                <div className="border-[#636363]  border-2 rounded-md flex gap-2 overflow-x-scroll max-w-full hide_scroll_bar">
                    {products.map((product) => (
                        <SpinnerItem
                            spinning={spin}
                            key={product.id}
                            product={product}
                            dummy={true}
                            className="w-[180px] "
                        />
                    ))}
                    {products.map((product) => (
                        <SpinnerItem
                            spinning={spin}
                            key={product.id}
                            product={product}
                            className="w-[180px] "
                        />
                    ))}
                    {products.map((product) => (
                        <SpinnerItem
                            spinning={spin}
                            key={product.id}
                            product={product}
                            dummy={true}
                            className="w-[180px] "
                        />
                    ))}
                </div>

                <span className="absolute -bottom-11 left-0 right-0 w-fit mx-auto ">
                    <ArrowUp />
                </span>
                <span className="absolute -top-8 left-0 right-0 w-fit mx-auto ">
                    <ArrowDown />
                </span>
            </div>
        </>
    );
}
