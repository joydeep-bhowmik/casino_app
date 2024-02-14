import Layout from "@/Layouts/Layout";
import BrowseItems from "./BrowseItems";
import { useState } from "react";
import Carts from "@/Components/Carts";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function index() {
    const [items, setItems] = useState([]);
    const [key, setKey] = useState(0);

    const handleSelect = (item) => {
        setItems((prevItems) => {
            let arr = new Set([...prevItems, item]);
            return [...arr];
        });
    };

    const removeItems = (id) => {
        setItems((pre) => [...pre.filter((item) => item.id != id)]);
    };

    const onCheckout = () => {
        setItems([]);
        setKey((pre) => ++pre);
    };

    const deleteAll = () => {
        setItems([]);
    };

    const onSold = (soldItems) => {
        let items_ = items.filter(
            (item) => !soldItems.some((soldItem) => soldItem.id === item.id)
        );
        setItems(items_);
        setKey((pre) => ++pre);
        soldItems.length && router.visit(route("checkout"));
    };

    return (
        <Layout>
            <div className="md:flex gap-5">
                <div className="space-y-5 w-full lg:max-w-[330px]">
                    <h2 className="text-xl font-bold text-white">Cart</h2>
                    <div className="min-h-80">
                        <Carts
                            items={items}
                            removeItems={removeItems}
                            deleteAll={deleteAll}
                            onSold={onSold}
                            onCheckout={onCheckout}
                        />
                    </div>

                    <center>
                        <Link
                            href={route("checkout")}
                            className="text-[#75ce61] underline text-center"
                        >
                            Continue to checkout
                        </Link>
                    </center>
                </div>
                <div className="space-y-5">
                    <h2 className="text-xl font-bold text-white">My Items</h2>
                    <BrowseItems
                        handleSelect={handleSelect}
                        selectedItems={items}
                        key={key}
                    />
                </div>
            </div>
        </Layout>
    );
}
