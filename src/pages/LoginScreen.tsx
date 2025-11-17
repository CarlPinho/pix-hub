import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"cliente" | "analista">("cliente");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === "cliente") {
      navigate("/customer");
    } else {
      navigate("/analyst");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 pb-8 pt-8">
          <div className="flex justify-center mb-2">
            <div className="text-3xl font-bold text-primary">
              Validador PIX
            </div>
          </div>
          <CardTitle className="text-center text-xl text-muted-foreground">
            Acesse sua conta
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={userType} onValueChange={(v) => setUserType(v as "cliente" | "analista")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="cliente">Cliente</TabsTrigger>
              <TabsTrigger value="analista">Analista</TabsTrigger>
            </TabsList>

            <TabsContent value="cliente" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username-cliente">CPF</Label>
                  <Input
                    id="username-cliente"
                    placeholder="000.000.000-00"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-cliente">Senha</Label>
                  <Input
                    id="password-cliente"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-6" size="lg">
                  Acessar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="analista" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username-analista">Usuário</Label>
                  <Input
                    id="username-analista"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-analista">Senha</Label>
                  <Input
                    id="password-analista"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-6" size="lg">
                  Acessar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
