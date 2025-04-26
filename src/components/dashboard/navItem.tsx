import { DashboardMenuItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type NavItemProps = {
    item: DashboardMenuItem;
    center?: boolean;
}

export default function NavItem({ item }: NavItemProps) {
    return (
        <Link key={item.label} href={item.href}>
            <li className="w-full flex items-center gap-2 rounded-md p-2 hover:bg-secondary group">
                <Image src={`/dashboard/${item.icon}.svg`} alt={item.label} width={20} height={20} className="group-hover:hidden" />
                <Image src={`/dashboard/${item.icon}-hovered.svg`} alt={item.label} width={20} height={20} className="hidden group-hover:block" />
                <p className="text-muted-foreground font-bold group-hover:text-primary">{item.label}</p>
            </li>
        </Link>
    )
}