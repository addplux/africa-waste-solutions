from flask import Flask, jsonify, request, send_file
from report_generator import generate_waste_report

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"status": "healthy", "service": "ai-service"})

@app.route('/generate-report', methods=['POST'])
def create_report():
    data = request.json
    pdf_buffer = generate_waste_report(data)
    return send_file(pdf_buffer, as_attachment=True, download_name='waste_report.pdf', mimetype='application/pdf')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
