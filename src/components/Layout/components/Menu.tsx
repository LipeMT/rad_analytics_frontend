interface MenuProps {
    menuOpened: boolean
}

export const Menu = ({ menuOpened }: MenuProps) => {
    return (
        <>
            {
                menuOpened &&
                <div className="bg-white rouded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
                    <ul className="list-none flex gap-5">
                        
                    </ul>
                </div>
            }
        </>
    )
}