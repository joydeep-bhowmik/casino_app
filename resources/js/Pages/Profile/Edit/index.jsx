import Layout from "@/Layouts/Layout";
import { useState } from "react";
import cn from "@/Libs/cn";
import Input from "@/Components/Input";
import Section from "@/Components/Section";
import PrimaryButton from "@/Components/PrimaryButton";
import UpdateProfileInformation from "../Partials/UpdateProfileInformationForm";
import UpdateShippingAddress from "../Partials/UpdateShippingAddress";
import UpdateAvatar from "../Partials/UpdateAvatar";

export default function index({ auth, mustVerifyEmail, status, countries }) {
    const [tab, setTab] = useState("profile");
    const tabs = [
        {
            tab: "profile",
            label: "profile",
        },
        {
            tab: "transactions",
            label: "Transactions",
        },
    ];

    return (
        <Layout user={auth.user}>
            <div className="space-y-5">
                <div className="border-b border-slate-700">
                    {tabs.map((o) => (
                        <button
                            key={o.tab}
                            onClick={() => {
                                setTab(o.tab);
                            }}
                            className={`font-bold text-slate-500 capitalize px-3 py-5  ${
                                tab == o.tab ? "border-b" : ""
                            }`}
                        >
                            {o.label ? o.label : o.tab}
                        </button>
                    ))}
                </div>

                <UpdateProfileInformation
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />

                <UpdateShippingAddress countries={countries} />

                <UpdateAvatar user={auth.user} />
            </div>
        </Layout>
    );
}
