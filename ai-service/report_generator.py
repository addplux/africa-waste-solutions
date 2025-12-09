from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

def generate_waste_report(data):
    """
    Generates a simple PDF report for waste management data.
    """
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Header
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, "Africa Waste Solutions - Monthly Report")
    
    # Line
    p.setLineWidth(1)
    p.line(50, height - 60, width - 50, height - 60)

    # Content
    y_position = height - 100
    p.setFont("Helvetica", 12)
    p.drawString(50, y_position, f"Report Generated for: {data.get('account_name', 'Unknown Account')}")
    y_position -= 20
    p.drawString(50, y_position, f"Period: {data.get('period', 'Current')}")
    
    y_position -= 40
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y_position, "Summary Statistics:")
    
    # Table Header
    y_position -= 20
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, y_position, "Level")
    p.drawString(150, y_position, "Supply")
    p.drawString(250, y_position, "Disposal")
    p.drawString(350, y_position, "Net Waste")

    # Data Rows
    p.setFont("Helvetica", 10)
    total_net = 0
    records = data.get('records', [])
    
    for row in records:
        y_position -= 20
        net = row['supply'] - row['disposal']
        total_net += net
        
        p.drawString(50, y_position, str(row['level']))
        p.drawString(150, y_position, str(row['supply']))
        p.drawString(250, y_position, str(row['disposal']))
        p.drawString(350, y_position, str(net))

    # Total
    y_position -= 30
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, y_position, "TOTAL NET WASTE IMPACT:")
    p.drawString(350, y_position, str(total_net))

    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer
