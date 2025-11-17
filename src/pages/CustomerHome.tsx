import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, Receipt, Download } from "lucide-react";

const CustomerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Olá, Carlos
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-md">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Área PIX</h2>
              
              <div className="flex justify-center my-8">
                <div className="w-32 h-32 bg-primary-light rounded-full flex items-center justify-center">
                  <ArrowLeftRight className="w-16 h-16 text-primary" />
                </div>
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <Button 
                  onClick={() => navigate("/pix-transfer")}
                  className="w-full" 
                  size="lg"
                >
                  Pagar com PIX
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full" size="lg">
                    <Receipt className="mr-2 h-5 w-5" />
                    Receber
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Extrato
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CustomerHome;
