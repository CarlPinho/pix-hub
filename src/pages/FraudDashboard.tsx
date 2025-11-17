import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Transaction = {
  id: string;
  date: string;
  amount: string;
  sender: string;
  recipient: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
};

const mockTransactions: Transaction[] = [
  {
    id: "TX001",
    date: "2024-01-15 14:32",
    amount: "R$ 5.000,00",
    sender: "Carlos Silva",
    recipient: "Maria Santos",
    reason: "Valor alto para perfil",
    status: "pending",
  },
  {
    id: "TX002",
    date: "2024-01-15 14:28",
    amount: "R$ 250,00",
    sender: "João Oliveira",
    recipient: "Pedro Costa",
    reason: "Múltiplas transferências",
    status: "pending",
  },
  {
    id: "TX003",
    date: "2024-01-15 14:15",
    amount: "R$ 1.200,00",
    sender: "Ana Paula",
    recipient: "Lucas Mendes",
    reason: "Primeiro PIX para destinatário",
    status: "approved",
  },
  {
    id: "TX004",
    date: "2024-01-15 14:10",
    amount: "R$ 8.500,00",
    sender: "Roberto Alves",
    recipient: "Conta Suspeita",
    reason: "Destinatário em lista restrita",
    status: "rejected",
  },
];

const FraudDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, status: "approved" as const } : t)
    );
    toast({
      title: "Transação aprovada",
      description: `Transação ${id} foi aprovada com sucesso.`,
    });
  };

  const handleReject = (id: string) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, status: "rejected" as const } : t)
    );
    toast({
      title: "Transação rejeitada",
      description: `Transação ${id} foi rejeitada.`,
      variant: "destructive",
    });
  };

  const filteredTransactions = transactions.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">
            Painel de Análise de Risco
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Transações PIX</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="pending">
                  Pendentes ({transactions.filter(t => t.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Aprovadas ({transactions.filter(t => t.status === "approved").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejeitadas ({transactions.filter(t => t.status === "rejected").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Remetente</TableHead>
                        <TableHead>Destinatário</TableHead>
                        <TableHead>Motivo da Suspeita</TableHead>
                        {filter === "pending" && <TableHead className="text-right">Ações</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            Nenhuma transação encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.id}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell className="font-semibold">{transaction.amount}</TableCell>
                            <TableCell>{transaction.sender}</TableCell>
                            <TableCell>{transaction.recipient}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {transaction.reason}
                              </Badge>
                            </TableCell>
                            {filter === "pending" && (
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-success hover:bg-success/10 hover:text-success border-success"
                                    onClick={() => handleApprove(transaction.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Aprovar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive"
                                    onClick={() => handleReject(transaction.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Rejeitar
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FraudDashboard;
