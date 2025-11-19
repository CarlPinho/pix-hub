import { useState, useEffect } from "react";
import axios from "axios";
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
// TIPAGEM FINAL DOS DADOS (DEVE BATER COM O TransactionResponse.java)
// ==========================================================
type UserResponse = {
  id: number;
  cpf: string;
  name: string;
  pixKey: string;
  pixKeyType: string;
};

type Transaction = {
  id: number; 
  value: number; 
  description: string;
  status: string; // O status do backend (ex: "SUCCESS", "PENDING_REVIEW")
  fraudCode: string | null;
  fraudDescription: string | null;
  sender: UserResponse;
  receiver: UserResponse;
};

type FilterStatus = "PENDING_REVIEW" | "SUCCESS" | "FAILED";

const API_BASE_URL = "http://localhost:8080/api/transactions";


const FraudDashboard = () => {
  const [filter, setFilter] = useState<FilterStatus>("PENDING_REVIEW");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // ==========================================================
  // 1. FUNÇÃO PARA BUSCAR OS DADOS REAIS DA API (CHAMADA GET)
  // ==========================================================
  const fetchTransactions = async (status: FilterStatus) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/status/${status}`
      );
      // O backend retorna o array de TransactionResponse
      setTransactions(response.data); 
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível buscar as transações da API. Servidor inativo ou erro de CORS.",
        variant: "destructive",
      });
      setTransactions([]);
    } finally {
        setIsLoading(false);
    }
  };

  // ==========================================================
  // 2. USEEFFECT: CARREGA DADOS QUANDO A ABA MUDA
  // ==========================================================
  useEffect(() => {
    // Quando o filtro muda (a aba), carregamos os novos dados
    fetchTransactions(filter);
  }, [filter]); 


  // ==========================================================
  // 3. FUNÇÕES DE APROVAÇÃO/REJEIÇÃO (CHAMADAS POST PARA AÇÃO)
  // ==========================================================
  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      // Endpoint exato que o seu backend espera: /transactions/{id}/approve
      const response = await axios.post(`${API_BASE_URL}/${id}/${action}`);
      
      const statusText = action === 'approve' ? 'aprovada' : 'rejeitada';

      toast({
        title: `Transação ${statusText}`,
        description: `Transação #${id} foi ${statusText} com sucesso.`,
      });
      
      // Atualiza a lista: remove o item processado da lista de pendentes
      setTransactions(prev => prev.filter(t => t.id !== id));

    } catch (error) {
      console.error(`Erro ao processar ${action}:`, error);
      // Alertamos o erro exato
      toast({ 
        title: "Erro ao processar transação", 
        description: "O servidor retornou um erro ao tentar mudar o status.",
        variant: "destructive" 
      });
    }
  };


  // Mapeamento de contagens (precisaríamos de 3 chamadas GET para contagens reais, mas usaremos o state atual)
  const pendingCount = transactions.length;

  return (
    <div className="min-h-screen bg-background">
      {/* ... (Header) ... */}
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
            <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="PENDING_REVIEW">
                  Pendentes ({filter === 'PENDING_REVIEW' ? pendingCount : 0})
                </TabsTrigger>
                <TabsTrigger value="SUCCESS">
                  Aprovadas
                </TabsTrigger>
                <TabsTrigger value="FAILED">
                  Rejeitadas
                </TabsTrigger>
              </TabsList>

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
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            Carregando dados...
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.length === 0 ? (
                            <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                Nenhuma transação encontrada no status: {filter}
                            </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">{transaction.id}</TableCell>
                                <TableCell className="font-semibold">
                                {/* Formatação de moeda para exibir na tela */}
                                {transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                                <TableCell>{transaction.sender.pixKey}</TableCell>
                                <TableCell>{transaction.receiver.pixKey}</TableCell>
                                <TableCell>
                                <Badge variant="outline" className="text-xs">
                                    {transaction.fraudDescription || 'N/A'}
                                </Badge>
                                </TableCell>
                                
                                {filter === "PENDING_REVIEW" && (
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-success hover:bg-success/10 hover:text-success border-success"
                                        onClick={() => handleAction(transaction.id, 'approve')}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Aprovar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive"
                                        onClick={() => handleAction(transaction.id, 'reject')}
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Rejeitar
                                    </Button>
                                    </div>
                                </TableCell>
                                )}
                            </TableRow>
                            ))
                        )
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