from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

words = ["python", "flask", "react", "javascript", "developer"]
word = random.choice(words)
guessed_word = ["_"] * len(word)
guessed_letters = set()
attempts = 6  

@app.route('/guess', methods=['POST'])
def guess_letter():
    global attempts, guessed_word, guessed_letters, word

    letter = request.json['letter'].lower()

    if letter in guessed_letters:
        return jsonify({
            "message": "Already guessed that letter.",
            "guessed_word": guessed_word,
            "attempts_left": attempts
        })

    guessed_letters.add(letter)
    
    if letter in word:
        for idx, char in enumerate(word):
            if char == letter:
                guessed_word[idx] = letter
        if "_" not in guessed_word:
            return jsonify({
                "message": "You won!",
                "guessed_word": guessed_word,
                "attempts_left": attempts
            })
    else:
        attempts -= 1
        if attempts == 0:
            return jsonify({
                "message": f"You lost! The word was {word}.",
                "guessed_word": guessed_word,
                "attempts_left": attempts
            })

    return jsonify({
        "message": "Keep guessing!",
        "guessed_word": guessed_word,
        "attempts_left": attempts
    })

@app.route('/reset', methods=['POST'])
def reset_game():
    global attempts, guessed_word, guessed_letters, word

    word = random.choice(words) 
    guessed_word = ["_"] * len(word)  
    guessed_letters = set() 
    attempts = 6  

    return jsonify({
        "guessed_word": guessed_word,
        "attempts_left": attempts,
        "message": ''
    })

if __name__ == '__main__':
    app.run(debug=True)
