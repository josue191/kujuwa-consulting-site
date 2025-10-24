
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const utilisateurs = [
  {
    nom: 'Admin Kujuwa',
    email: 'admin@kujuwaconsulting.com',
    role: 'Admin',
    dateCreation: '01/01/2024',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
  },
  {
    nom: 'Editeur Contenu',
    email: 'editeur@kujuwaconsulting.com',
    role: 'Éditeur',
    dateCreation: '15/02/2024',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
  },
    {
    nom: 'Recruteur RH',
    email: 'rh@kujuwaconsulting.com',
    role: 'Recruteur',
    dateCreation: '20/03/2024',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
  },
];


export default function UtilisateursPage() {
    return (
        <div className="w-full">
            <div className="flex justify-end mb-4">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un utilisateur
                </Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {utilisateurs.map((user) => (
                    <TableRow key={user.email}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.nom} />
                                    <AvatarFallback>{user.nom.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{user.nom}</div>
                                    <div className="text-muted-foreground text-sm">{user.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.dateCreation}</TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </div>
    );
}
