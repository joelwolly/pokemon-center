'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:3001/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      alert('Treinador registrado com sucesso! Agora você pode entrar no sistema.');
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao registrar treinador.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0f172a]">
      <div className="card-treinador w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
             <div className="h-10 w-10 border-4 border-gray-800 rounded-full bg-white relative overflow-hidden mx-auto">
                <div className="absolute top-0 w-full h-1/2 bg-blue-500" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 bg-white border-2 border-gray-800 rounded-full z-10" />
             </div>
          </div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Novo Treinador
          </h1>
          <p className="text-gray-500 text-sm font-medium">Crie sua conta administrativa</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nome Completo</label>
            <input
              type="text"
              placeholder="Ex: Joel Santos"
              className="input-pokemon w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none focus:border-blue-500 transition"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">E-mail</label>
            <input
              type="email"
              placeholder="seu-email@provedor.com"
              className="input-pokemon w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 outline-none focus:border-blue-500 transition"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Senha</label>
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
            {loading ? 'Cadastrando...' : 'Finalizar Registro'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link href="/login" className="text-sm font-bold text-red-500 hover:text-red-700 transition">
            Já possui cadastro? Voltar ao Login
          </Link>
        </div>

      </div>
    </div>
  );
}