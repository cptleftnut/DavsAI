import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';

const monsters = {
  gnist: { id: 'gnist', navn: 'Gnist', ikon: '⚡', farve: '#FFD700', hilsen: 'Zapp! Jeg er klar!' },
  flamme: { id: 'flamme', navn: 'Flamme', ikon: '🔥', farve: '#FF4500', hilsen: 'Wroaar! Lad os kæmpe!' },
  vand: { id: 'vand', navn: 'Aqua', ikon: '💧', farve: '#1E90FF', hilsen: 'Plask... Hvad sker der?' },
  plante: { id: 'plante', navn: 'Spire', ikon: '🌱', farve: '#32CD32', hilsen: 'Grooow. Jeg lytter roligt.' },
  ræv: { id: 'ræv', navn: 'Vix', ikon: '🦊', farve: '#FF8C00', hilsen: 'Hihi. Hvad skal vi finde på?' },
  spøgelse: { id: 'spøgelse', navn: 'Skygge', ikon: '👻', farve: '#8A2BE2', hilsen: 'Bøøøh! Heh, skræmte jeg dig?' },
  bjørn: { id: 'bjørn', navn: 'Dovne', ikon: '💤', farve: '#A52A2A', hilsen: '*Gisb*... Er det vigtigt?' }
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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // Wake-up call to Render backend
  useEffect(() => {
    fetch('https://davslm.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping', monster_type: 'gnist' })
    }).catch(() => {
      console.log("Server opvarmning startet...");
    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input.trim();
    setChat(prev => [...prev, { role: 'user', text: userInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://davslm.onrender.com/api/chat', {
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
      setChat(prev => [...prev, { role: 'ai', text: "Hov, ingen forbindelse til skyen!" }]);
      setCurrentMood('ked_af_det');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663373318604/nMZDrjrsxfTrXunVMCPQDL/davsai-chat-pattern-KaMVmsrA7wK7BkdLoRDNfB.webp)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-300 via-orange-300 to-purple-300 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">DAVSlm</h1>
          <p className="text-center text-gray-700 mt-2">Chat med dine monstre-venner!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* Monster Face Display */}
        <Card className="mb-8 p-8 bg-white border-4 shadow-xl" style={{ borderColor: monsterData.farve }}>
          <div className="flex flex-col items-center gap-4">
            <div className="text-7xl">{monsterData.ikon}</div>
            <div className="text-6xl">{moodMap[currentMood as keyof typeof moodMap] || moodMap.neutral}</div>
            <h2 className="text-2xl font-bold text-gray-800">{monsterData.navn}</h2>
            <p className="text-gray-600 italic">{monsterData.hilsen}</p>
          </div>
        </Card>

        {/* Chat Box */}
        <Card className="mb-8 p-6 h-96 overflow-y-auto bg-white/95 shadow-lg border-2 border-orange-200">
          <div className="space-y-4">
            <div className="text-center text-gray-600 font-semibold mb-4">
              [{monsterData.navn}]: {monsterData.hilsen}
            </div>
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl shadow-md transition-all duration-300 ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </Card>

        {/* Monster Selector */}
        <div className="mb-8 p-4 bg-white rounded-2xl shadow-lg border-2 border-yellow-300">
          <p className="text-center text-gray-700 font-semibold mb-4">Vælg dit monster:</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {Object.values(monsters).map(monster => (
              <button
                key={monster.id}
                onClick={() => setActiveMonster(monster.id)}
                className={`text-4xl p-3 rounded-full transition-all duration-300 ${
                  activeMonster === monster.id
                    ? 'bg-yellow-300 scale-125 shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 opacity-60 hover:opacity-100'
                }`}
                title={monster.navn}
              >
                {monster.ikon}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-3 bg-white p-4 rounded-2xl shadow-lg border-2 border-orange-300">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Skriv dine tanker..."
            className="flex-1 border-0 focus:outline-none text-lg"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 rounded-full font-bold text-white transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: monsterData.farve }}
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
      <div className="bg-gradient-to-r from-purple-300 via-orange-300 to-yellow-300 py-4 mt-8">
        <p className="text-center text-gray-700 text-sm">
          Lavet med ❤️ til DAVSlm fællesskabet
        </p>
      </div>
    </div>
  );
}
