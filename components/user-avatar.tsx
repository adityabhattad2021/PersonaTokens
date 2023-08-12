import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps{
    src?:string;
}

export default function UserAvatar({src}:UserAvatarProps){
    return (
        <Avatar className="h-12 w-12">
            <AvatarImage
                src={src}
            />
            <AvatarFallback>
                YOU
            </AvatarFallback>
        </Avatar>
    )
}