import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Zap, Flame, Droplets, Leaf, Ghost, Moon, Eye } from 'lucide-react';

const monsters = {
  gnist: { id: 'gnist', navn: 'Gnist', ikon: <Zap className="w-8 h-8" />, farve: '#00f2ff', hilsen: 'SYSTEM: Gnist.exe indlæst. Klar til upload!' },
  flamme: { id: 'flamme', navn: 'Flamme', ikon: <Flame className="w-8 h-8" />, farve: '#ff2a6d', hilsen: 'ADVARSEL: Termisk overbelastning. Lad os brænde!' },
  vand: { id: 'vand', navn: 'Aqua', ikon: <Droplets className="w-8 h-8" />, farve: '#05ffa1', hilsen: 'FLUX: Strømmen flyder roligt gennem kredsløbet.' },
  plante: { id: 'plante', navn: 'Spire', ikon: <Leaf className="w-8 h-8" />, farve: '#32CD32', hilsen: 'BIOS: Organisk integration fuldført.' },
  ræv: { id: 'ræv', navn: 'Vix', ikon: <Eye className="w-8 h-8" />, farve: '#ff8c00', hilsen: 'SNEAK: Scanner efter skjulte data...' },
  spøgelse: { id: 'spøgelse', navn: 'Skygge', ikon: <Ghost className="w-8 h-8" />, farve: '#bc13fe', hilsen: 'GHOST: Fejl i virkeligheds-protokollen. Bøh!' },
  bjørn: { id: 'bjørn', navn: 'Dovne', ikon: <Moon className="w-8 h-8" />, farve: '#ff00ff', hilsen: 'SLEEP: Dvale-tilstand aktiv. Hvad nu?' }
};

const moodMap = {
  glad: '😊', ked_af_det: '😢', sur: '😠', forvirret: '😕',
  træt: '😴', forelsket: '😍', chokeret: '😱', sarkastisk: '😏',
  stolt: '😎', nysgerrig: '🧐', bange: '😨', neutral: '😐'
};

type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
};

export default function Home() {
  const [activeMonster, setActiveMonster] = useState('gnist');
  const [currentMood, setCurrentMood] = useState('neutral');
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const monsterData = monsters[activeMonster as keyof typeof monsters];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    fetch('https://davsai-backend.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping', monster_type: 'gnist' })
    }).catch(() => {
      console.log("Backend opvarmning startet...");
    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input.trim();
    setChat(prev => [...prev, { role: 'user', text: userInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://davsai-backend.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, monster_type: activeMonster })
      });

      if (!response.ok) throw new Error('Server fejl');

      const data = await response.json();
      if (data && data.svar) {
        setChat(prev => [...prev, { role: 'ai', text: data.svar }]);
        setCurrentMood(data.humor && moodMap[data.humor as keyof typeof moodMap] ? data.humor : 'neutral');
      } else {
        throw new Error('Ugyldigt format fra server');
      }
    } catch (error) {
      setChat(prev => [...prev, { role: 'ai', text: "Kritiske systemfejl: Forbindelse til skyen afbrudt." }]);
      setCurrentMood('ked_af_det');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Scanline effect overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50"></div>

      {/* Header */}
      <div className="border-b border-primary/30 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-black text-center neon-text-cyan tracking-tighter">
            DAVS<span className="text-secondary neon-text-magenta">AI</span>
          </h1>
          <p className="text-center text-primary/70 font-mono text-xs mt-1 uppercase tracking-widest">
            {'>'} Interface v2.0 // Cybernetic Monster Hub
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl relative">
        {/* Monster Display */}
        <Card className="mb-8 p-8 bg-card/80 border-2 border-primary/50 shadow-[0_0_20px_rgba(0,242,255,0.2)] backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl opacity-20 bg-primary animate-pulse"></div>
              <div className="text-8xl transform transition-transform group-hover:scale-110 duration-500">
                {moodMap[currentMood as keyof typeof moodMap] || moodMap.neutral}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold neon-text-cyan mb-1 flex items-center justify-center gap-2">
                <span style={{ color: monsterData.farve }}>{monsterData.ikon}</span>
                {monsterData.navn}
              </h2>
              <p className="text-primary/60 font-mono text-sm italic">
                {monsterData.hilsen}
              </p>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 font-mono text-[10px] text-primary/30 uppercase">
            Status: Online // Mood: {currentMood}
          </div>
        </Card>

        {/* Chat Box */}
        <Card className="mb-8 p-6 h-96 overflow-y-auto bg-card/60 border border-primary/30 shadow-inner custom-scrollbar">
          <div className="space-y-6">
            <div className="text-center font-mono text-[10px] text-primary/40 uppercase tracking-widest border-b border-primary/10 pb-2">
              --- Begyndelse af krypteret session ---
            </div>
            {chat.length === 0 && (
              <div className="text-center text-primary/40 font-mono text-sm py-10 italic">
                Venter på bruger-input...
              </div>
            )}
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-lg font-mono text-sm relative ${
                    msg.role === 'user'
                      ? 'bg-primary/10 border border-primary/50 text-primary rounded-tr-none'
                      : 'bg-secondary/10 border border-secondary/50 text-secondary rounded-tl-none'
                  }`}
                >
                  <div className={`absolute top-0 ${msg.role === 'user' ? 'right-0 translate-x-1/2 -translate-y-1/2' : 'left-0 -translate-x-1/2 -translate-y-1/2'} w-2 h-2 rotate-45 ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}></div>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </Card>

        {/* Monster Selector */}
        <div className="mb-8 p-4 bg-card/40 border border-primary/20 rounded-xl">
          <p className="text-center text-primary/60 font-mono text-[10px] uppercase tracking-tighter mb-4">Vælg din Cyber-Makker:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.values(monsters).map(monster => (
              <button
                key={monster.id}
                onClick={() => setActiveMonster(monster.id)}
                className={`p-3 rounded-lg transition-all duration-300 border-2 ${
                  activeMonster === monster.id
                    ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(0,242,255,0.4)] scale-110'
                    : 'border-transparent bg-muted/50 opacity-40 hover:opacity-100 hover:border-primary/30'
                }`}
                style={{ color: monster.farve }}
                title={monster.navn}
              >
                {monster.ikon}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-3 bg-card/80 p-2 rounded-xl border-2 border-primary/40 shadow-[0_0_20px_rgba(0,242,255,0.1)] focus-within:border-primary transition-all duration-300">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Indtast kommando..."
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-primary font-mono placeholder:text-primary/30"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/80 text-primary-foreground font-black px-6 shadow-[0_0_10px_rgba(0,242,255,0.5)] transition-all active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-primary/20 bg-card/30 py-4 mt-8">
        <p className="text-center text-primary/40 font-mono text-[10px] uppercase tracking-widest">
          [ DavsAI Neural Network // Established 2024 ]
        </p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 242, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 242, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 242, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
