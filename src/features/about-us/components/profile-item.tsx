import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

type ProfileItemProps = {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
  linkedinUrl: string;
  githubUrl: string;
};

const getInitials = (name: string): string => {
  const [first = '', second = ''] = name.trim().split(/\s+/);
  return (first[0] ?? '').toUpperCase() + (second[0] ?? '').toUpperCase();
};

const ProfileItem = ({
  name,
  position,
  imageUrl,
  description,
  linkedinUrl,
  githubUrl,
}: ProfileItemProps) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={imageUrl} alt="Profile" />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{position}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-start gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={linkedinUrl} target="_blank" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href={githubUrl} target="_blank" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileItem;
