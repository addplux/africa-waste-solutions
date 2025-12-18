from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from report_generator import generate_waste_report
import os

app = Flask(__name__)

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:8080,http://localhost:5173').split(',')
CORS(app, origins=cors_origins, supports_credentials=True)

@app.route('/')
def home():
    return jsonify({"status": "healthy", "service": "ai-service"})

@app.route('/generate-report', methods=['POST'])
def create_report():
    data = request.json
    pdf_buffer = generate_waste_report(data)
    return send_file(pdf_buffer, as_attachment=True, download_name='waste_report.pdf', mimetype='application/pdf')

@app.route('/analyze', methods=['POST'])
def analyze_data():
    data = request.json
    # Simple heuristic analysis for MVP
    # In a real app, this would call OpenAI/Gemini
    context = data.get('context', '')
    items = data.get('data', [])
    
    insight = "Analysis of Recent Activity:\n"
    if not items:
        insight += "No sufficient data to generate insights yet."
    else:
        supply_count = sum(1 for i in items if 'supply' in i.lower())
        transfer_count = sum(1 for i in items if 'transfer' in i.lower())
        return_count = sum(1 for i in items if 'return' in i.lower())
        
        insight += f"- Verified {len(items)} recent distinct transactions.\n"
        if supply_count > transfer_count:
            insight += "- Supply levels are currently outpacing distribution. Consider increasing transfer schedules.\n"
        elif transfer_count > return_count:
            insight += "- Distribution is healthy, but waste return rates are lagging behind supply.\n"
        
        insight += "- Recommendation: Review the 'Disposable' category stocks for consistency."

    return jsonify({"insight": insight})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
