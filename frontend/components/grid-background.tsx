import React from "react";

interface GridBackgroundProps {
    children?: React.ReactNode;
    className?: string;
}

export const GridBackground = ({ children, className }: GridBackgroundProps) => (
    <div className={`relative ${className || ''}`}>
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        {children}
    </div>
);
