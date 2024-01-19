export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "bg-[#242424] rounded border-[#313131] text-indigo-600 shadow-sm focus:ring-indigo-500 " +
                className
            }
        />
    );
}
