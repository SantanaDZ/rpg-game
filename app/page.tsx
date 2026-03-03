import Link from "next/link"
import { Swords, Shield, Diamond, Skull, Crown, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 bg-slate-950 text-slate-100 overflow-hidden relative">

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="flex flex-col items-center gap-12 text-center max-w-4xl pt-24 pb-16 z-10 w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold tracking-widest uppercase mb-4">
            <Diamond className="w-4 h-4 fill-amber-500" /> SDZ Games Apresenta
          </div>
          <img
            src="/header-rpg-game.png"
            alt="Dungeon RPG Header"
            className="w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 mb-6 object-cover aspect-[21/9]"
          />
          <div className="flex items-center gap-4">
            <Swords className="h-12 w-12 text-amber-500" />
            <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-red-600 drop-shadow-sm">
              Dungeon RPG
            </h1>
            <Shield className="h-12 w-12 text-amber-500" />
          </div>
        </div>

        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
          Crie heróis, suba de nível, enfrente hordas de monstros e lute em batalhas de turno impiedosas. Qual classe você irá escolher?
        </p>

        <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-10 py-4 text-lg font-bold text-white transition-all hover:bg-amber-500 hover:scale-105 shadow-xl shadow-amber-900/20"
          >
            <Swords className="h-5 w-5" />
            Entrar na Batalha
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-10 py-4 text-lg font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            Criar Personagem
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 w-full mt-8">

          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm transition-all hover:border-amber-500/50">
            <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Skull className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Dungeon Defense</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sobreviva a hordas crescentes de monstros em tempo real usando a velocidade e inteligência do seu personagem.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm transition-all hover:border-amber-500/50">
            <div className="p-4 rounded-xl bg-red-500/10 text-red-500">
              <Swords className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Battle Arena</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Um combate de turnos baseado em reações rápidas (QTE). Enfrente chefes épicos e vença sem errar um único movimento.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm transition-all hover:border-amber-500/50">
            <div className="p-4 rounded-xl bg-amber-500/10 text-amber-500">
              <Crown className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Classes e Níveis</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              De Cavaleiros a Ogros, escolha sua classe, distribua pontos de atributos e suba de nível ganhando batalhas.
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}
