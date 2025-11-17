import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Bell, Eye, EyeOff, ArrowLeftRight } from "lucide-react";

const CustomerHome = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header com gradiente vermelho */}
      <div className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground px-4 pt-4 pb-24 rounded-b-[2rem]">
        {/* Top bar com avatar, nome e ações */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">C</span>
            </div>
            <span className="font-medium">Carlos Silva</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full text-[10px] flex items-center justify-center">
                1
              </span>
            </button>
            <button onClick={() => navigate("/")} className="text-sm font-medium">
              Sair
            </button>
          </div>
        </div>

        {/* Saldo */}
        <div className="space-y-1">
          <div className="text-sm opacity-90">Saldo</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold">
                {showBalance ? "R$ 5.420,00" : "R$ ••••••"}
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button className="text-sm underline opacity-90 hover:opacity-100">
              Ver extrato
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="px-4 -mt-16">
        {/* Seção Favoritos */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Favoritos</h2>
          
          <div className="grid grid-cols-4 gap-4">
            {/* Card PIX */}
            <button
              onClick={() => navigate("/pix-transfer")}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 bg-card rounded-2xl shadow-md flex items-center justify-center group-hover:shadow-lg transition-all group-active:scale-95">
                <ArrowLeftRight className="w-7 h-7 text-primary" />
              </div>
              <span className="text-xs text-foreground text-center">Pix</span>
            </button>
          </div>
        </div>

        {/* Banner informativo */}
        <Card className="bg-card shadow-md overflow-hidden mb-6">
          <div className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                O Pix no Bradesco está ainda melhor
              </h3>
              <p className="text-sm text-muted-foreground">
                Pix com seguro contra golpe
              </p>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <ArrowLeftRight className="w-8 h-8 text-primary" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerHome;
