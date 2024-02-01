import { forwardRef } from "react";

export default forwardRef(function Section({ title, children, ...props }, ref) {
    return (
        <section className="bg rounded-md" ref={ref} {...props}>
            {title && (
                <header className="p-5 ">
                    <h2 className="text-base font-semibold capitalize">
                        {title}
                    </h2>
                </header>
            )}
            <article className="p-5">{children}</article>
        </section>
    );
});
