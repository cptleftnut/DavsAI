import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
# Tillader DAVSlm appen at snakke med serveren
CORS(app) 

# Sikkerhed: Henter Groq API-nøglen fra Renders "Environment Variables"
api_key = os.environ.get("GROQ_API_KEY") 
client = Groq(api_key=api_key)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get('message', '')
    monster_type = data.get('monster_type', 'gnist') 

    # Definerer monstrenes personligheder under DAVSlm-universet
    system_prompt = f"""
Du er en virtuel makker i DAVSlm appen. Din type er: {monster_type}.
Du skal altid svare på dansk. Bliv i din rolle som monsteret.
- gnist: Energisk, glad, hurtig.
- flamme: Modig, passioneret, hidsig.
- vand: Afslappet, kølig.
- plante: Omsorgsfuld, tænksom.
- ræv: Nysgerrig, sød.
- spøgelse: Drilsk, sarkastisk.
- bjørn: Træt, sulten.

Du har +50 humør-tilstande (f.eks. 'glad', 'ked_af_det', 'sur', 'træt', 'chokeret', 'neutral', 'forelsket', 'forvirret' osv.).
VIGTIGT: Du SKAL svare i valid JSON format med præcis to nøgler: "svar" og "humor".
Eksempel: {{"svar": "Wow, det vidste jeg ikke!", "humor": "chokeret"}}
"""

    try:
        # Kald til Groqs Llama-3 model
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_msg}
            ],
            model="llama3-8b-8192", 
            response_format={"type": "json_object"} # Tvinger AI'en til at levere JSON
        )
        
        # Udtræk og send JSON direkte tilbage til appen
        response_data = json.loads(chat_completion.choices[0].message.content)
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Fejl: {e}")
        return jsonify({"svar": "DAVSlm serveren fejlede lige et øjeblik...", "humor": "ked_af_det"}), 500

if __name__ == '__main__':
    # Nødvendigt for at Render kan styre serverens port
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
