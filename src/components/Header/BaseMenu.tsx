import clsx from "clsx";
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuItems } from "@/constants/menu";
import { getActions } from '@/stores';

type BaseMenuProps = {
    className: string;
    itemClassName: string;
    menuClassName: string;
    activeClassName: string;
    children?: React.ReactNode;
}

export default function BaseMenu({
    className,
    itemClassName,
    menuClassName,
    activeClassName,
    children
}: BaseMenuProps) {
    const navigate = useNavigate()
    const location = useLocation();
    const { toggleMenu } = getActions();

    const isActive = (url: string) => {
        return location.pathname === url;
    };

    const handleMenuClick = (url: string) => {
        navigate(url);
        toggleMenu()
    };

    return (
        <div className={className}>
            {MenuItems.map(({ name, Icon, url }) => (
                <div
                    key={name}
                    className={clsx(itemClassName, { [activeClassName]: isActive(url) })}
                    onClick={() => handleMenuClick(url)}
                >
                    <Icon />
                    <span className={menuClassName}>{name}</span>
                </div>
            ))}
            {children}
        </div>
    );
}