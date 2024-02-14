import Section from "@/Components/Section";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import { url } from "@/Libs/urls";
export default function UpdateAvatar({ user }) {
    const { data, setData, post, progress } = useForm({ avatar: null });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.avatar.update"), {
            onError: (error) => {
                console.log(error);
            },
        });
    };

    return (
        <Section title="Avatar">
            <form onSubmit={submit} className="space-y-5">
                <div>
                    Upload a file from your device. The image must be square and
                    have a minimum size of 184px x 184px.
                </div>
                <input
                    type="file"
                    className="hidden"
                    name="avatar"
                    id="avatar"
                    onChange={(e) => {
                        setData("avatar", e.target.files[0]);
                    }}
                />
                <label
                    htmlFor="avatar"
                    className="h-[84px] cursor-pointer block bg-black border-slate-900 w-[84px] rounded-full overflow-hidden border-2"
                >
                    <img
                        className="object-contain h-full"
                        src={
                            data.avatar
                                ? URL.createObjectURL(data.avatar)
                                : user.avatar
                                ? url("/storage/avatars/" + user.avatar)
                                : url("/assets/avatars/seccao.png")
                        }
                        alt=""
                    />
                </label>

                <button
                    className={`change-btn p-4 rounded-md min-w-32 h-9 uppercase text-xs  `}
                >
                    Change
                </button>
            </form>
        </Section>
    );
}
