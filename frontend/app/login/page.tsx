'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function decodeToken(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,{
        email,
        password,
      });

      const { access_token, name } = response.data;

      localStorage.setItem('token', access_token);

      if (name) {
        localStorage.setItem('name', name);
      } else {
        const decoded = decodeToken(access_token);
        if (decoded?.name) {
          localStorage.setItem('name', decoded.name);
        } else {
          localStorage.setItem('name', 'Treinador'); 
        }
      }
      router.push('/pokedex'); 
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      alert(error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0f172a]">
      <div className="card-treinador w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-red-50 mb-4">
            <div className="h-10 w-10 border-4 border-gray-800 rounded-full bg-white relative overflow-hidden mx-auto">
                <div className="absolute top-0 w-full h-1/2 bg-red-500" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 bg-white border-2 border-gray-800 rounded-full z-10" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Centro Pokémon
          </h1>
          <p className="text-gray-500 text-sm font-medium">Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Identificação</label>
            <input
              type="email"
              placeholder="E-mail do instrutor"
              className="input-pokemon w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none focus:border-blue-500 transition"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Senha de Acesso</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-pokemon w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none focus:border-blue-500 transition"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl uppercase tracking-widest transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Validando...' : 'Acessar Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link href="/register" className="text-sm font-bold text-blue-500 hover:text-blue-700 transition">
            Novo por aqui? Cadastre-se como Treinador
          </Link>
        </div>
      </div>
    </div>
  );
}