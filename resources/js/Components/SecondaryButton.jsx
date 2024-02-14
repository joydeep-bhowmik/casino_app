export default function SecondaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                ` inline-flex  items-center justify-center p-4  border-2 font-semibold border-[#404040] rounded-lg 
            text-xs uppercase tracking-widest ${disabled && "opacity-25"} ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
