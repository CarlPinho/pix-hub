import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock } from "lucide-react";

type AlertType = "success" | "error" | "pending" | null;

const PixTransferForm = () => {
  const navigate = useNavigate();
  const [pixKey, setPixKey] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [alertType, setAlertType] = useState<AlertType>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simula análise de fraude
    const random = Math.random();
    if (random < 0.33) {
      setAlertType("success");
    } else if (random < 0.66) {
      setAlertType("pending");
    } else {
      setAlertType("error");
    }

    // Limpa o alerta após 5 segundos
    setTimeout(() => {
      setAlertType(null);
      if (random < 0.33) {
        navigate("/customer");
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/customer")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Pagar PIX</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Dados da transferência</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pixKey">Para quem?</Label>
                <Input
                  id="pixKey"
                  placeholder="Digite a chave PIX"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  placeholder="R$ 0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Input
                  id="description"
                  placeholder="Ex: Pagamento de conta"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {alertType === "success" && (
                <Alert className="bg-success/10 border-success text-success-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    Pagamento enviado com sucesso!
                  </AlertDescription>
                </Alert>
              )}

              {alertType === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Falha na transação. Tente novamente.
                  </AlertDescription>
                </Alert>
              )}

              {alertType === "pending" && (
                <Alert className="bg-amber-50 border-amber-500 text-amber-900">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    Sua transação está em análise.
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full mt-6" size="lg">
                Continuar
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PixTransferForm;
