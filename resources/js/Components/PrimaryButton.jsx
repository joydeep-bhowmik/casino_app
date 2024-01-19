export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `primary-btn inline-flex  items-center justify-center p-4  border border-transparent  font-semibold 
            text-xs uppercase tracking-widest ${disabled && "opacity-25"} ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
