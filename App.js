import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

const monsters = {
// ... (resten af din kode fortsætter herunder)
export default function App() {
  const [activeMonster, setActiveMonster] = useState('gnist');
  const [currentMood, setCurrentMood] = useState('neutral');
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const monsterData = monsters[activeMonster];

  // WAKE-UP CALL TIL RENDER
  useEffect(() => {
    fetch('https://davslm.onrender.com/api/chat', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping', monster_type: 'gnist' })
    }).catch(() => {
      console.log("Server opvarmning startet...");
    });
  }, []); // Kører kun én gang, når appen starter

  // ... (resten af din sendMessage funktion og return) ...
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

export default function App() {
  const [activeMonster, setActiveMonster] = useState('gnist');
  const [currentMood, setCurrentMood] = useState('neutral');
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const monsterData = monsters[activeMonster];

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
      const data = await response.json();
      if (data.svar) {
        setChat(prev => [...prev, { role: 'ai', text: data.svar }]);
        setCurrentMood(moodMap[data.humor] ? data.humor : 'neutral');
      }
    } catch (error) {
      setChat(prev => [...prev, { role: 'ai', text: "Hov, ingen forbindelse til skyen!" }]);
      setCurrentMood('ked_af_det');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appHeader}>DAVSlm</Text>
      <View style={[styles.faceContainer, { borderColor: monsterData.farve }]}>
        <Text style={styles.monsterIcon}>{monsterData.ikon}</Text>
        <Text style={styles.moodFace}>{moodMap[currentMood] || moodMap.neutral}</Text>
        <Text style={styles.monsterName}>{monsterData.navn}</Text>
      </View>
      <ScrollView style={styles.chatBox}>
        <Text style={styles.greeting}>[{monsterData.navn}]: {monsterData.hilsen}</Text>
        {chat.map((msg, idx) => (
          <View key={idx} style={[styles.msgBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.msgText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.values(monsters).map(monster => (
            <TouchableOpacity key={monster.id} onPress={() => setActiveMonster(monster.id)} style={styles.selectorTouch}>
              <Text style={[styles.selectorIcon, activeMonster === monster.id && { opacity: 1 }]}>{monster.ikon}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Skriv..." />
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: monsterData.farve }]} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 15 },
  appHeader: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  faceContainer: { alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 4 },
  monsterIcon: { fontSize: 20, position: 'absolute', top: 10, left: 15 },
  moodFace: { fontSize: 60 },
  monsterName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  greeting: { color: '#aaa', fontStyle: 'italic', marginBottom: 5 },
  chatBox: { flex: 1, backgroundColor: '#2a2a2a', marginVertical: 15, borderRadius: 15, padding: 10 },
  msgBubble: { padding: 10, borderRadius: 15, marginVertical: 5, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007BFF' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#444' },
  msgText: { color: '#fff' },
  selectorContainer: { height: 60, marginBottom: 10 },
  selectorTouch: { marginHorizontal: 10 },
  selectorIcon: { fontSize: 35, opacity: 0.3 },
  inputContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 25, padding: 5 },
  input: { flex: 1, paddingHorizontal: 15 },
  sendButton: { padding: 10, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});
