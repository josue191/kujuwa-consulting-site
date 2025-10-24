
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

const contenus = [
    {
        titre: 'Page: Qui sommes-nous ?',
        type: 'Page',
        modifieLe: '10/07/2024',
    },
    {
        titre: 'Article: Les défis de la construction durable',
        type: 'Article de blog',
        modifieLe: '05/07/2024',
    },
    {
        titre: 'Page: Nos services',
        type: 'Page',
        modifieLe: '01/07/2024',
    }
]

export default function ContenuPage() {
  return (
    <div className="w-full">
        <div className="flex justify-end mb-4">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter du contenu
            </Button>
        </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dernière modification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contenus.map((item) => (
              <TableRow key={item.titre}>
                <TableCell className="font-medium">{item.titre}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.modifieLe}</TableCell>
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
