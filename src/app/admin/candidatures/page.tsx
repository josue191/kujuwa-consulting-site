
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
import { MoreHorizontal } from 'lucide-react';

const candidatures = [
  {
    nom: 'Alice Martin',
    poste: 'Chef de Projet en Construction',
    date: '15/07/2024',
    statut: 'Nouveau',
  },
  {
    nom: 'Bob Dupont',
    poste: 'Spécialiste en Suivi & Évaluation',
    date: '12/07/2024',
    statut: 'En cours',
  },
  {
    nom: 'Charlie Durand',
    poste: 'Gestionnaire de Flotte',
    date: '10/07/2024',
    statut: 'Archivé',
  },
];

export default function CandidaturesPage() {
  return (
    <div className="w-full">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du candidat</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Date de soumission</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidatures.map((candidature) => (
              <TableRow key={candidature.nom}>
                <TableCell className="font-medium">{candidature.nom}</TableCell>
                <TableCell>{candidature.poste}</TableCell>
                <TableCell>{candidature.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      candidature.statut === 'Nouveau'
                        ? 'default'
                        : candidature.statut === 'En cours'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {candidature.statut}
                  </Badge>
                </TableCell>
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
