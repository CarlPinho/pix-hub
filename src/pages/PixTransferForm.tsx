import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import InputMask from "react-input-mask";
import CurrencyInput from "react-currency-input-field";

type AlertType = "success" | "error" | "pending" | null;
type AlertMessage = string | null;
type PixKeyType = "CPF" | "EMAIL" | "PHONE" | "RANDOM_KEY";

const PixTransferForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>("EMAIL");
  const [pixKey, setPixKey] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [alertType, setAlertType] = useState<AlertType>(null);
  const [alertMessage, setAlertMessage] = useState<AlertMessage>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertType(null);

    if (!user) return; 

    const unmaskedPixKey = pixKey.replace(/[.\-() ]/g, "");

    const requestBody = {
      sender: {
        pixKeyType: user.pixKeyType,
        pixKey: user.pixKey,
      },
      receiver: {
        pixKeyType: pixKeyType,
        pixKey: unmaskedPixKey,
      },
      value: parseFloat(amount || "0"),
      description: description,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/transactions",
        requestBody
      );
      
      const data = response.data;
      if (data.status === "SUCCESS") {
        setAlertType("success");
        setAlertMessage("Pagamento enviado com sucesso!");
        setTimeout(() => {
          navigate("/customer");
        }, 3000);
      } else if (data.status === "PENDING_REVIEW") {
        setAlertType("pending");
        setAlertMessage(
          `Sua transação está em análise. (Motivo: ${data.fraudDescription})`
        );
      } else if (data.status === "FAILED") {
        setAlertType("error");
        setAlertMessage(
          `Falha na transação: ${data.fraudDescription || "Tente novamente."}`
        );
      }
    } catch (error) {
      console.error("Erro ao enviar a transação:", error);
      setAlertType("error");
      setAlertMessage("Erro ao conectar com o servidor. Tente mais tarde.");
    }
  };

  const renderPixKeyInput = () => {
    const inputClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    switch (pixKeyType) {
      case "CPF":
        return (
          <InputMask
            mask="999.999.999-99"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            className={inputClassName}
            placeholder="000.000.000-00"
            required
          />
        );
      case "PHONE":
        return (
          <InputMask
            mask="(99) 99999-9999"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            className={inputClassName}
            placeholder="(00) 00000-0000"
            required
          />
        );
      case "EMAIL":
        return (
          <Input
            id="pixKey"
            type="email"
            placeholder="exemplo@email.com"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            required
          />
        );
      case "RANDOM_KEY":
      default:
        return (
          <Input
            id="pixKey"
            placeholder="Chave aleatória (UUID)"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            required
          />
        );
    }
  };
  
  const shadCnInputStyle = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  if (!user) {
    return <div>Carregando...</div>;
  }

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
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-2">
                  <Label htmlFor="pixKeyType">Tipo de Chave</Label>
                  <Select
                    value={pixKeyType}
                    onValueChange={(value) => {
                      setPixKeyType(value as PixKeyType);
                      setPixKey("");
                    }}
                  >
                    <SelectTrigger id="pixKeyType">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL">E-mail</SelectItem>
                      <SelectItem value="CPF">CPF</SelectItem>
                      <SelectItem value="PHONE">Celular</SelectItem>
                      <SelectItem value="RANDOM_KEY">Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="pixKey">Chave</Label>
                  {renderPixKeyInput()}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <CurrencyInput
                  id="amount"
                  name="amount"
                  placeholder="R$ 0,00"
                  value={amount}
                  onValueChange={(value) => setAmount(value || "")}
                  intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                  className={shadCnInputStyle}
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

              {/* === CÓDIGO CORRIGIDO ABAIXO === */}

              {alertType === "success" && (
                <Alert className="bg-success/10 border-success text-success-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    {alertMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              {alertType === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
              )}

              {alertType === "pending" && (
                <Alert className="bg-amber-50 border-amber-500 text-amber-900">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    {alertMessage}
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