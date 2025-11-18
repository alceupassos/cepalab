"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [otpInfo, setOtpInfo] = useState<{ secret: string; otpauth: string } | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    fetch("/api/auth/otp-info")
      .then((r) => r.json())
      .then((data) => setOtpInfo(data))
      .catch(() => setOtpInfo(null));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { code, redirect: false });
    setLoading(false);
    if (res && !res.error) {
      const now = new Date().toISOString();
      document.cookie = `otp_validated_at=${encodeURIComponent(now)}; max-age=86400; path=/`;
      router.push("/cepalab/dashboard/enhanced");
    }
    else setError("Código inválido");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Autenticação TOTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input placeholder="Código do Google Authenticator" value={code} onChange={(e) => setCode(e.target.value)} />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Validando..." : "Entrar"}</Button>
          </form>
          <div className="mt-3 text-xs text-muted-foreground">Validação obrigatória uma vez por dia</div>

          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={() => setShowSetup(!showSetup)}>
              {showSetup ? "Ocultar configuração" : "Configurar Google Authenticator"}
            </Button>
            {showSetup && (
              <div className="mt-3 space-y-2 text-sm">
                <div className="text-gray-600 dark:text-gray-300">Escaneie o QR para vincular seu app:</div>
                {otpInfo?.otpauth && (
                  <img
                    alt="QR code"
                    className="mx-auto rounded border"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpInfo.otpauth)}`}
                  />
                )}
                {otpInfo?.secret && (
                  <div className="mt-2">
                    <div className="text-gray-600 dark:text-gray-300">Código secreto (caso precise inserir manualmente):</div>
                    <div className="font-mono text-xs p-2 rounded bg-gray-100 dark:bg-gray-800">{otpInfo.secret}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}