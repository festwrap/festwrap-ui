import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/Avatar';
import { Linkedin, Github, Mail } from 'lucide-react';
import { Button } from '@components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@components/ui/Card';

type ProfileItemProps = {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
  linkedinUrl: string;
  githubUrl: string;
  email: string;
};

const ProfileItem = ({
  name,
  position,
  imageUrl,
  description,
  linkedinUrl,
  githubUrl,
  email,
}: ProfileItemProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={imageUrl} alt="Profile" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{position}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
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
        <Button variant="outline" size="icon" asChild>
          <Link href={`mailto:${email}`} aria-label="Email">
            <Mail className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileItem;
