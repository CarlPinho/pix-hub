import { useState, useEffect } from "react"; // Importamos o useEffect
import axios from "axios"; // Importamos o Axios
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

// ==========================================================
// 1. ATUALIZAMOS O 'TYPE' PARA BATER COM A RESPOSTA REAL DA API
// ==========================================================
type UserResponse = {
  id: number;
  cpf: string;
  name: string;
  pixKey: string;
  pixKeyType: string;
};

type Transaction = {
  id: number; // Era string, agora é number
  value: number; // Era string (ex: "R$ 5.000,00"), agora é number
  description: string;
  status: string; // O status do backend (ex: "SUCCESS", "PENDING_REVIEW")
  fraudCode: string;
  fraudDescription: string;
  sender: UserResponse;
  receiver: UserResponse;
  // O campo 'date' não existe na sua API, usaremos o 'id'
};

// Mapeia o status do backend para o filtro local
type FilterStatus = "PENDING_REVIEW" | "SUCCESS" | "FAILED";

const FraudDashboard = () => {
  // O state agora armazena o status do backend
  const [filter, setFilter] = useState<FilterStatus>("PENDING_REVIEW");
  
  // O state começa vazio, não com mocks
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // ==========================================================
  // 2. FUNÇÃO PARA BUSCAR OS DADOS REAIS DA API
  // ==========================================================
  const fetchTransactions = async (status: FilterStatus) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/transactions/status/${status}`
      );
      setTransactions(response.data); // Coloca os dados da API no state
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível buscar as transações da API.",
        variant: "destructive",
      });
    }
  };

  // ==========================================================
  // 3. USEEFFECT: O 'CÉREBRO' QUE RODA QUANDO A TELA CARREGA
  // ==========================================================
  // Isso vai rodar uma vez quando o componente carregar,
  // e de novo toda vez que o 'filter' (a aba) mudar.
  useEffect(() => {
    fetchTransactions(filter);
  }, [filter]); // O 'trigger' é a mudança do filtro

  // ==========================================================
  // 4. ATUALIZAMOS OS BOTÕES PARA CHAMAR A API
  // ==========================================================
  const handleApprove = async (id: number) => {
    try {
      // Chama o novo endpoint /approve
      await axios.post(`http://localhost:8080/api/transactions/${id}/approve`);
      
      toast({
        title: "Transação aprovada",
        description: `Transação ${id} foi aprovada com sucesso.`,
      });
      
      // Atualiza a lista: remove o item aprovado da lista de pendentes
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      toast({ title: "Erro ao aprovar transação", variant: "destructive" });
    }
  };

  const handleReject = async (id: number) => {
    try {
      // Chama o novo endpoint /reject
      await axios.post(`http://localhost:8080/api/transactions/${id}/reject`);
      
      toast({
        title: "Transação rejeitada",
        description: `Transação ${id} foi rejeitada.`,
        variant: "destructive",
      });
      
      // Atualiza a lista: remove o item rejeitado da lista de pendentes
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      toast({ title: "Erro ao rejeitar transação", variant: "destructive" });
    }
  };

  // Contagem para as abas (agora vem do state real)
  const pendingCount = filter === 'PENDING_REVIEW' ? transactions.length : 0;
  // (Idealmente, faríamos 3 chamadas separadas para pegar todas as contagens)

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        {/* ... (Seu JSX de Header - não muda) ... */}
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
            <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                
                {/* 5. Ajustamos os 'value' das abas para bater com o backend */}
                <TabsTrigger value="PENDING_REVIEW">
                  Pendentes ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="SUCCESS">
                  Aprovadas
                </TabsTrigger>
                <TabsTrigger value="FAILED">
                  Rejeitadas
                </TabsTrigger>
              </TabsList>

              {/* A tabela agora é renderizada 3x, uma para cada aba */}
              {/* (O conteúdo (TabsContent) já faz isso) */}
              <TabsContent value={filter} className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Remetente (Chave)</TableHead>
                        <TableHead>Destinatário (Chave)</TableHead>
                        <TableHead>Motivo da Suspeita</TableHead>
                        {filter === "PENDING_REVIEW" && <TableHead className="text-right">Ações</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            Nenhuma transação encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        // 6. Mapeamos os dados reais da API
                        transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.id}</TableCell>
                            <TableCell className="font-semibold">
                              {/* Formatamos o número (Double) para R$ */}
                              {transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </TableCell>
                            <TableCell>{transaction.sender.pixKey}</TableCell>
                            <TableCell>{transaction.receiver.pixKey}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {transaction.fraudDescription}
                              </Badge>
                            </TableCell>
                            
                            {/* Os botões agora chamam as funções 'async' */}
                            {filter === "PENDING_REVIEW" && (
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