export default function RetryIcon({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={25}
            fill="none"
            {...props}
        >
            <path
                stroke="#404040"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m11.328 9.707-2.12 2.121a1 1 0 0 0 0 1.415l2.12 2.12a1 1 0 0 0 1.415 0l2.121-2.12a1 1 0 0 0 0-1.415l-2.121-2.12a1 1 0 0 0-1.415 0Z"
            />
            <path
                stroke="#404040"
                strokeLinecap="square"
                strokeWidth={1.5}
                d="M20.06 8.5a9 9 0 0 0-8.064-5C8.462 3.5 5.473 5.537 4 8.5M4 4.5v4M7.39 8.5H4M4 16.5a9 9 0 0 0 8.065 5c3.533 0 6.522-2.037 7.995-5M20.06 20.5v-4M16.67 16.5h3.39"
            />
        </svg>
    );
}
