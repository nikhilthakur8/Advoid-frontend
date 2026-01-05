import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useUserContext } from "@/context/Context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

export function Navbar() {
	const isMobile = useIsMobile();
	const { user } = useUserContext();
	return (
		<NavigationMenu
			viewport={isMobile}
			className="fixed  top-0 left-0  min-w-full z-50 py-2"
		>
			<NavigationMenuList className="flex-wrap">
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/" className="text-sm md:text-base">
							Home
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/dashboard" className="text-sm md:text-base">
							Dashboard
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={navigationMenuTriggerStyle()}
					>
						<Link to="/profile" className="text-sm md:text-base">
							Profile
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				{user && user.role.toLocaleLowerCase() === "admin" && (
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link to="/admin" className="text-sm md:text-base">
								Admin
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				)}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
