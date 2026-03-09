'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function PokedexPage() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);

  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [newLevel, setNewLevel] = useState<number>(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pokemonToDelete, setPokemonToDelete] = useState<any>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
  };

  const fetchPokemons = async () => {
    const token = getToken();
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pokemon`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPokemons(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPokemons();
  }, []);

  const handleCapture = async () => {
    const token = getToken();
    setCapturing(true);
    try {
      const randomId = Math.floor(Math.random() * 151) + 1;
      const pokeData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

      const newPokemon = {
        name: pokeData.data.name.toUpperCase(),
        type: pokeData.data.types[0].type.name,
        level: Math.floor(Math.random() * 100) + 1,
        hp: pokeData.data.stats[0].base_stat,
        pokedexNumber: randomId,
        color: 'Oficial',
        imageUrl: pokeData.data.sprites.other['official-artwork'].front_default
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pokemon`, newPokemon, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchPokemons();
    } catch {
      alert("ERRO NA CAPTURA");
    } finally {
      setCapturing(false);
    }
  };

  const confirmDelete = async () => {
    const token = getToken();
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/pokemon/${pokemonToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsDeleteModalOpen(false);
      fetchPokemons();
    } catch (err) {
      alert("Você não tem permissão para remover este Pokémon");
    }
  };

  const confirmUpdate = async () => {
    const token = getToken();
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/pokemon/${selectedPokemon.id}`, 
        { level: Number(newLevel) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditModalOpen(false);
      fetchPokemons();
    } catch (err) {
      alert("Erro ao atualizar ou permissão negada");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 relative">
      
      <nav className="flex justify-between items-center mb-12 border-b border-white/5 pb-4">
        <h1 className="text-2xl font-black italic">
          POKE<span className="text-blue-500">DEV</span>
        </h1>
        <div className="flex items-center gap-6">
          
          <button onClick={() => { localStorage.clear(); router.replace('/login'); }} className="text-xs font-bold text-red-500">SAIR</button>
        </div>
      </nav>

      <header className="flex justify-between items-end mb-10">
        <h2 className="text-4xl font-black uppercase">Minha Coleção</h2>
        <button onClick={handleCapture} disabled={capturing} className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          {capturing ? 'CAPTURANDO...' : 'CAPTURAR'}
        </button>
      </header>

      {loading ? (
        <p className="text-center text-gray-400">Carregando Pokémons...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemons.map((pokemon) => (
            <div key={pokemon.id} className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 hover:border-blue-500 transition-all group">
              <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-4">
                <span>#0{pokemon.pokedexNumber}</span>
                <span className="text-blue-400 font-bold">LVL {pokemon.level}</span>
              </div>
              <img src={pokemon.imageUrl} alt={pokemon.name} className="h-32 mx-auto mb-4 group-hover:scale-110 transition-transform"/>
              <h3 className="text-xl font-black text-center uppercase mb-6">{pokemon.name}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedPokemon(pokemon); setNewLevel(pokemon.level); setIsEditModalOpen(true); }}
                  className="flex-1 bg-white/5 py-2 rounded-lg text-[10px] font-bold hover:bg-white/10"
                >EDITAR</button>
                <button 
                  onClick={() => { setPokemonToDelete(pokemon); setIsDeleteModalOpen(true); }}
                  className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-lg text-[10px] font-bold hover:bg-red-500/20"
                >SOLTAR</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] p-8 rounded-3xl w-full max-w-sm border border-white/10">
            <h3 className="text-xl font-black mb-4 uppercase">Subir Nível</h3>
            <p className="text-sm text-gray-400 mb-6">Ajuste o level de <span className="text-white font-bold">{selectedPokemon?.name}</span></p>
            <input 
              type="number" 
              value={newLevel} 
              onChange={(e) => setNewLevel(Number(e.target.value))}
              className="w-full bg-[#0f172a] border border-white/10 p-4 rounded-xl mb-6 outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500">CANCELAR</button>
              <button onClick={confirmUpdate} className="flex-1 py-3 bg-blue-600 rounded-xl text-sm font-bold">SALVAR</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] p-8 rounded-3xl w-full max-w-sm border border-white/10 text-center">
            <div className="text-4xl mb-4">😰</div>
            <h3 className="text-xl font-black mb-2 uppercase">Tem certeza?</h3>
            <p className="text-sm text-gray-400 mb-8 text-balance">Você vai soltar o <span className="text-white font-bold">{pokemonToDelete?.name}</span> na natureza para sempre.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500">CANCELAR</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 rounded-xl text-sm font-bold">SOLTAR AGORA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}