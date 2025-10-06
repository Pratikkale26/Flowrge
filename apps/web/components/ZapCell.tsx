
export const ZapCell = ({
    name,
    index,
    onClick
}: {
    name?: string; 
    index: number;
    onClick: () => void;
}) => {
    return (
        <div 
            onClick={onClick} 
            className="border border-border py-6 px-8 flex w-[320px] justify-center cursor-pointer 
                       bg-card/80 hover:bg-card transition-all duration-200 rounded-xl
                       hover:border-accent/50 hover:shadow-lg group backdrop-blur-sm"
        >
            <div className="flex text-lg text-foreground group-hover:text-accent transition-colors">
                <div className="font-semibold mr-3 text-muted-foreground group-hover:text-accent">
                    {index}.
                </div>
                <div className="font-medium">
                    {name}
                </div>
            </div>
        </div>
    )
}