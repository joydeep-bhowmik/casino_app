import PrimaryButton from "@/Components/PrimaryButton";
import { Link, useForm, usePage } from "@inertiajs/react";
import Input from "@/Components/Input";
import Section from "@/Components/Section";
import { useState } from "react";
import Select from "@/Components/Games/Select";

export default function UpdateShippingAddress({
    status,
    className = "",
    countries,
}) {
    const user = usePage().props.auth.user;
    const address = user.address;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: address?.first_name,
            last_name: address?.last_name,
            address_1: address?.address_1,
            address_2: address?.address_2,
            pin_code: address?.pin_code,
            city: address?.city,
            state: address?.state,
            country: address?.country,
            country_code: address?.country_code,
            phone_number: address?.phone_number,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("address.update"));
    };

    return (
        <>
            <Section title="Shipping address">
                <form onSubmit={submit}>
                    <div className="lg:columns-2 space-y-5">
                        <Input
                            label="First name"
                            id="first_name"
                            className="mt-1 block w-full"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            autoComplete="first_name"
                            error={errors.first_name}
                        />

                        <Input
                            label="Last name"
                            id="last_name"
                            className="mt-1 block w-full"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            autoComplete="last_name"
                            error={errors.last_name}
                        />

                        <Input
                            label="Address 1"
                            id="address_1"
                            className="mt-1 block w-full"
                            value={data.address_1}
                            onChange={(e) =>
                                setData("address_1", e.target.value)
                            }
                            autoComplete="address-line1"
                            error={errors.address_1}
                        />

                        <Input
                            label="Address 2"
                            id="address_2"
                            className="mt-1 block w-full"
                            value={data.address_2}
                            onChange={(e) =>
                                setData("address_2", e.target.value)
                            }
                            autoComplete="address-line2"
                            error={errors.address_2}
                        />

                        <Input
                            label="POSTAL / ZIP CODE*"
                            id="pin_code"
                            className="mt-1 block w-full"
                            value={data.pin_code}
                            onChange={(e) =>
                                setData("pin_code", e.target.value)
                            }
                            autoComplete="postal-code"
                            error={errors.pin_code}
                        />

                        <Input
                            label="City"
                            id="city"
                            className="mt-1 block w-full"
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                            autoComplete="city"
                            error={errors.city}
                        />

                        <Input
                            label="State"
                            id="state"
                            className="mt-1 block w-full"
                            value={data.state}
                            onChange={(e) => setData("state", e.target.value)}
                            autoComplete="address-level1"
                            error={errors.state}
                        />

                        <Input
                            label="Country"
                            id="country"
                            className="mt-1 block w-full"
                            value={data.country}
                            onChange={(e) => setData("country", e.target.value)}
                            autoComplete="country"
                            error={errors.country}
                        />

                        {/* <Input
                            id="country_code"
                            className="mt-1 block w-full"
                            autoComplete="country-code"
                        /> */}

                        <div>
                            <Input
                                label="Phone number"
                                id="phone_number"
                                className="mt-1 block w-full"
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData("phone_number", e.target.value)
                                }
                                autoComplete="tel"
                                error={errors.phone_number}
                                prefix={
                                    <select
                                        className="bg-[#111] rounded !border-0 !ring-0"
                                        onChange={(e) =>
                                            setData(
                                                "country_code",
                                                e.target.value
                                            )
                                        }
                                        value={data.country_code}
                                        error={errors.country_code}
                                    >
                                        {countries.map((country) => (
                                            <option
                                                value={country.code}
                                                key={country.id}
                                            >
                                                {country.code}
                                            </option>
                                        ))}
                                    </select>
                                }
                            />
                        </div>
                    </div>

                    <PrimaryButton
                        disabled={processing}
                        className="text-black min-w-32 h-12 mt-9"
                    >
                        Save
                    </PrimaryButton>
                </form>
            </Section>
        </>
    );
}
