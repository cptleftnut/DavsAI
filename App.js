import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

// De 7 DAVSlm monstre
const monsters = {
  gnist: { id: 'gnist', navn: 'Gnist', ikon: '⚡', farve: '#FFD700', hilsen: 'Zapp! Jeg er klar!' },
  flamme: { id: 'flamme', navn: 'Flamme', ikon: '🔥', farve: '#FF4500', hilsen: 'Wroaar! Lad os kæmpe!' },
  vand: { id: 'vand', navn: 'Aqua', ikon: '💧', farve: '#1E90FF', hilsen: 'Plask... Hvad sker der?' },
  plante: { id: 'plante', navn: 'Spire', ikon: '🌱', farve: '#32CD32', hilsen: 'Grooow. Jeg lytter roligt.' },
  ræv: { id: 'ræv', navn: 'Vix', ikon: '🦊', farve: '#FF8C00', hilsen: 'Hihi. Hvad skal vi finde på?' },
  spøgelse: { id: 'spøgelse', navn: 'Skygge', ikon: '👻', farve: '#8A2BE2', hilsen: 'Bøøøh! Heh, skræmte jeg dig?' },
  bjørn: { id: 'bjørn', navn: 'Dovne', ikon: '💤', farve: '#A52A2A', hilsen: '*Gisb*... Er det vigtigt?' }
};

// Pladsholdere for humør
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
      // Din specifikke Render URL er nu indsat her!
      const BACKEND_URL = 'https://davslm.onrender.com/api/chat'; 

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          monster_type: activeMonster
        })
      });

      const data = await response.json();
      
      if (data.svar && data.humor) {
        setChat(prev => [...prev, { role: 'ai', text: data.svar }]);
        setCurrentMood(moodMap[data.humor] ? data.humor : 'neutral');
      } else {
        setChat(prev => [...prev, { role: 'ai', text: "Forstod ikke JSON-formatet fra DAVSlm-skyen..." }]);
        setCurrentMood('forvirret');
      }

    } catch (error) {
      console.error("Netværksfejl:", error);
      setChat(prev => [...prev, { role: 'ai', text: "Hov, jeg har mistet forbindelsen til skyen!" }]);
      setCurrentMood('ked_af_det');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Header */}
      <Text style={styles.appHeader}>DAVSlm</Text>

      {/* Ansigtet og humøret */}
      <View style={[styles.faceContainer, { borderColor: monsterData.farve }]}>
        <Text style={styles.monsterIcon}>{monsterData.ikon}</Text>
        <Text style={styles.moodFace}>{moodMap[currentMood] || moodMap.neutral}</Text>
        <Text style={styles.monsterName}>{monsterData.navn}</Text>
      </View>

      {/* Chatboksen */}
      <ScrollView style={styles.chatBox} contentContainerStyle={{ paddingBottom: 10 }}>
        <Text style={styles.greeting}>[{monsterData.navn}]: {monsterData.hilsen}</Text>
        {chat.map((msg, idx) => (
          <View key={idx} style={[styles.msgBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.msgText}>{msg.text}</Text>
          </View>
        ))}
        {isLoading && <Text style={styles.loadingText}>DAVSlm tænker...</Text>}
      </ScrollView>

      {/* Vælg Monster */}
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
          {Object.values(monsters).map(monster => (
            <TouchableOpacity key={monster.id} onPress={() => { setActiveMonster(monster.id); setCurrentMood('neutral'); }} style={styles.selectorTouch}>
              <Text style={[styles.selectorIcon, activeMonster === monster.id && { opacity: 1, transform: [{ scale: 1.2 }] }]}>
                {monster.ikon}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input-felt */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={20}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            value={input} 
            onChangeText={setInput} 
            placeholder={`Snak med ${monsterData.navn}...`} 
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: monsterData.farve }]} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 15, paddingTop: Platform.OS === 'android' ? 40 : 10 },
  
  appHeader: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, letterSpacing: 2 },
  faceContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 4, marginBottom: 15, elevation: 5 },
  monsterIcon: { fontSize: 30, position: 'absolute', top: 10, left: 15 },
  moodFace: { fontSize: 80 }, 
  monsterName: { fontSize: 18, fontWeight: 'bold', marginTop: 5, color: '#333' },
  
  chatBox: { flex: 1, backgroundColor: '#2a2a2a', padding: 10, borderRadius: 15, marginBottom: 15 },
  greeting: { fontSize: 14, fontStyle: 'italic', textAlign: 'center', marginBottom: 15, color: '#888' },
  msgBubble: { padding: 10, borderRadius: 15, marginVertical: 4, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007BFF' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#444' },
  msgText: { color: '#fff', fontSize: 16 },
  loadingText: { color: '#888', fontStyle: 'italic', alignSelf: 'flex-start', marginLeft: 10, marginTop: 5 },

  selectorContainer: { height: 70, marginBottom: 10, backgroundColor: '#333', borderRadius: 15, paddingVertical: 5 },
  selectorScroll: { alignItems: 'center', paddingHorizontal: 10 },
  selectorTouch: { marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  selectorIcon: { fontSize: 40, opacity: 0.3 },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingLeft: 15, paddingRight: 5, paddingVertical: 5 },
  input: { flex: 1, height: 40, color: '#333', fontSize: 16 },
  sendButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});
