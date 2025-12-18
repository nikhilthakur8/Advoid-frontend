import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

export function Navbar() {
	const isMobile = useIsMobile();

	return (
		<NavigationMenu
			viewport={isMobile}
			className="fixed top-0 left-0 max-w-full z-50 py-2 mx-auto"
		>
			<NavigationMenuList className="flex-wrap">
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/">Home</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/dashboard">Dashboard</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/profile">Profile</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
