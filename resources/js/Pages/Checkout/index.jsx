import Layout from "@/Layouts/Layout";
import { url } from "@/Libs/urls";
import PrimaryButton from "@/Components/PrimaryButton";
export default function index({ carts, address }) {
    return (
        <Layout>
            <div className="space-y-5 lg:space-y-0 md:flex gap-3">
                <div className="space-y-3 lg:max-w-xs w-full">
                    <h2 className="text-xl font-semibold">Ordered Items</h2>
                    {carts.map((cart) => (
                        <div
                            key={cart.id}
                            className="flex items-center gap-8 p-3 relative rounded-md border-l-red-700 border-l-2 bg-[#181818] "
                        >
                            <div className="h-20  max-w-20">
                                <img
                                    src={url(cart.product.image_url)}
                                    alt=""
                                    className="h-full object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">
                                    {cart.product.name}
                                </h3>
                                <div className="text-base font-bold">
                                    €{cart.product.price}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full">
                    <div className="p-3 bg  rounded-md">
                        <h2 className="text-xl font-semibold">Your Address</h2>

                        <div className="space-y-3 py-3">
                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    First Name
                                </label>
                                <div>{address.first_name}</div>
                            </div>
                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    Last Name
                                </label>
                                <div>{address.last_name}</div>
                            </div>
                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    Address Line 1
                                </label>
                                <div>{address.address_1}</div>
                            </div>
                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    Address Line 2
                                </label>
                                <div>{address.address_2}</div>
                            </div>
                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    City
                                </label>
                                <div>{address.city}</div>
                            </div>
                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    State
                                </label>
                                <div>{address.state}</div>
                            </div>
                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    Pin Code
                                </label>
                                <div>{address.pin_code}</div>
                            </div>

                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    Phone Number
                                </label>
                                <div>{address.phone_number}</div>
                            </div>
                            <div>
                                <label className="uppercase tracking-wide text-xs">
                                    Country
                                </label>
                                <div>{address.country}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PrimaryButton className="mt-5 ">Place order</PrimaryButton>
        </Layout>
    );
}
